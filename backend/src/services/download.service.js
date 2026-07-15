const supabase = require('../config/supabase');
const { logger } = require('../utils/logger');

/**
 * Get download history for a user with pagination
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {object} Download history with pagination
 */
exports.getDownloadHistory = async (userId, page = 1, limit = 20) => {
    try {
        const offset = (page - 1) * limit;

        // Fetch download count
        const { count } = await supabase
            .from('downloads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Fetch paginated downloads
        const { data: downloads, error: fetchError } = await supabase
            .from('downloads')
            .select(`
                id,
                product_id,
                file_name,
                file_size,
                download_url,
                status,
                initiated_at,
                completed_at,
                products (
                    id,
                    name,
                    seller_id
                )
            `)
            .eq('user_id', userId)
            .order('initiated_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (fetchError) throw fetchError;

        const pagination = {
            page,
            limit,
            total: count,
            pages: Math.ceil(count / limit)
        };

        return {
            data: downloads,
            pagination
        };
    } catch (error) {
        logger.error(`Failed to fetch download history for user ${userId}`, error);
        throw new Error(`Failed to fetch download history: ${error.message}`);
    }
};

/**
 * Get details of a specific download
 * @param {string} downloadId - Download ID
 * @param {string} userId - User ID (for authorization)
 * @returns {object} Download details
 */
exports.getDownloadDetails = async (downloadId, userId) => {
    try {
        if (!downloadId) {
            throw new Error('Download ID is required');
        }

        const { data: download, error } = await supabase
            .from('downloads')
            .select(`
                id,
                user_id,
                product_id,
                file_name,
                file_size,
                file_type,
                download_url,
                status,
                initiated_at,
                completed_at,
                products (
                    id,
                    name,
                    description,
                    seller_id,
                    price
                )
            `)
            .eq('id', downloadId)
            .single();

        if (error || !download) {
            throw new Error('Download not found');
        }

        // Verify ownership
        if (download.user_id !== userId) {
            throw new Error('Unauthorized access to download');
        }

        return download;
    } catch (error) {
        logger.error(`Failed to fetch download details for ${downloadId}`, error);
        throw error;
    }
};

/**
 * Initiate download - verify purchase and generate signed URL
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @returns {object} Download record with signed URL
 */
exports.initiateDownload = async (userId, productId) => {
    try {
        if (!userId || !productId) {
            throw new Error('User ID and Product ID are required');
        }

        // Step 1: Verify product exists
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id, name, file_path, file_name, file_size, file_type')
            .eq('id', productId)
            .single();

        if (productError || !product) {
            throw new Error('Product not found');
        }

        // Step 2: Verify purchase exists
        const { data: purchase, error: purchaseError } = await supabase
            .from('orders')
            .select('id, status, product_id')
            .eq('product_id', productId)
            .eq('buyer_id', userId)
            .single();

        if (purchaseError || !purchase) {
            throw new Error('Purchase not found');
        }

        // Step 3: Verify payment is completed
        if (purchase.status !== 'completed') {
            throw new Error('Payment not completed');
        }

        // Step 4: Verify product file exists in storage
        if (!product.file_path) {
            throw new Error('Product file not found');
        }

        // Step 5: Generate signed download URL (valid for 24 hours)
        const { data: signedUrl, error: signedUrlError } = await supabase
            .storage
            .from('products')
            .createSignedUrl(product.file_path, 86400); // 24 hours in seconds

        if (signedUrlError || !signedUrl) {
            throw new Error('Failed to generate download URL');
        }

        // Step 6: Create download record
        const { data: download, error: downloadError } = await supabase
            .from('downloads')
            .insert([{
                user_id: userId,
                product_id: productId,
                file_name: product.file_name,
                file_size: product.file_size,
                file_type: product.file_type,
                download_url: signedUrl.signedUrl,
                status: 'initiated',
                initiated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (downloadError) throw downloadError;

        // Step 7: Increment product download count
        const { data: currentProduct, error: fetchError } = await supabase
            .from('products')
            .select('download_count')
            .eq('id', productId)
            .single();

        if (!fetchError && currentProduct) {
            await supabase
                .from('products')
                .update({ download_count: (currentProduct.download_count || 0) + 1 })
                .eq('id', productId);
        }

        logger.info(`Download initiated for user ${userId}, product ${productId}`);

        return download;
    } catch (error) {
        logger.error(`Failed to initiate download for user ${userId}, product ${productId}`, error);
        throw error;
    }
};

/**
 * Track download completion
 * @param {string} downloadId - Download ID
 * @param {string} userId - User ID (for authorization)
 * @returns {object} Updated download record
 */
exports.trackDownloadCompletion = async (downloadId, userId) => {
    try {
        if (!downloadId) {
            throw new Error('Download ID is required');
        }

        // Step 1: Fetch download record and verify ownership
        const { data: download, error: fetchError } = await supabase
            .from('downloads')
            .select('id, user_id, product_id')
            .eq('id', downloadId)
            .single();

        if (fetchError || !download) {
            throw new Error('Download record not found');
        }

        if (download.user_id !== userId) {
            throw new Error('Unauthorized access');
        }

        // Step 2: Update download status to completed
        const { data: updated, error: updateError } = await supabase
            .from('downloads')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', downloadId)
            .select()
            .single();

        if (updateError) throw updateError;

        logger.info(`Download completed: ${downloadId} for user ${userId}`);

        return updated;
    } catch (error) {
        logger.error(`Failed to track download completion for ${downloadId}`, error);
        throw error;
    }
};

/**
 * Verify user has access to download a product
 * Used internally for authorization checks
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @returns {boolean} True if user can download
 */
exports.verifyDownloadAccess = async (userId, productId) => {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select('id, status')
            .eq('product_id', productId)
            .eq('buyer_id', userId)
            .eq('status', 'completed')
            .single();

        return !error && order !== null;
    } catch (error) {
        logger.error(`Failed to verify download access for user ${userId}, product ${productId}`, error);
        return false;
    }
};

/**
 * Get download count for a product
 * @param {string} productId - Product ID
 * @returns {number} Total downloads
 */
exports.getProductDownloadCount = async (productId) => {
    try {
        const { count, error } = await supabase
            .from('downloads')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', productId)
            .eq('status', 'completed');

        if (error) throw error;

        return count || 0;
    } catch (error) {
        logger.error(`Failed to get download count for product ${productId}`, error);
        return 0;
    }
};

/**
 * Clean up expired download URLs
 * Should be called periodically via cron job
 */
exports.cleanupExpiredDownloads = async () => {
    try {
        const expiryTime = new Date(Date.now() - 86400000).toISOString(); // 24 hours ago

        const { error } = await supabase
            .from('downloads')
            .update({ status: 'expired' })
            .eq('status', 'initiated')
            .lt('initiated_at', expiryTime);

        if (error) throw error;

        logger.info('Cleanup of expired downloads completed');
    } catch (error) {
        logger.error('Failed to cleanup expired downloads', error);
    }
};
