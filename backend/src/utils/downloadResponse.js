/**
 * Download response formatter
 * Formats download data for consistent API responses
 */

/**
 * Format single download response
 * @param {object} download - Download record
 * @returns {object} Formatted response
 */
exports.downloadResponse = (download) => {
    if (!download) {
        return {
            success: false,
            message: 'Download record is invalid'
        };
    }

    return {
        success: true,
        message: 'Download initiated successfully',
        data: {
            id: download.id,
            productId: download.product_id,
            fileName: download.file_name,
            fileSize: download.file_size,
            fileType: download.file_type,
            downloadUrl: download.download_url,
            status: download.status,
            initiatedAt: download.initiated_at,
            completedAt: download.completed_at || null,
            expiresAt: calculateExpiryTime(download.initiated_at)
        }
    };
};

/**
 * Format download history response
 * @param {array} downloads - Array of download records
 * @param {object} pagination - Pagination metadata
 * @returns {object} Formatted response with pagination
 */
exports.downloadHistoryResponse = (downloads, pagination) => {
    if (!Array.isArray(downloads)) {
        return {
            success: false,
            message: 'Invalid download history data'
        };
    }

    return {
        success: true,
        message: 'Download history retrieved successfully',
        data: downloads.map(download => ({
            id: download.id,
            productId: download.product_id,
            productName: download.products?.name || 'Unknown',
            fileName: download.file_name,
            fileSize: download.file_size,
            status: download.status,
            initiatedAt: download.initiated_at,
            completedAt: download.completed_at || null,
            productDetails: download.products ? {
                id: download.products.id,
                name: download.products.name,
                sellerId: download.products.seller_id
            } : null
        })),
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            pages: pagination.pages
        }
    };
};

/**
 * Format download details response
 * @param {object} download - Download record with product details
 * @returns {object} Formatted response
 */
exports.downloadDetailsResponse = (download) => {
    if (!download) {
        return {
            success: false,
            message: 'Download details not found'
        };
    }

    return {
        success: true,
        message: 'Download details retrieved successfully',
        data: {
            id: download.id,
            productId: download.product_id,
            fileName: download.file_name,
            fileSize: download.file_size,
            fileType: download.file_type,
            downloadUrl: download.download_url,
            status: download.status,
            initiatedAt: download.initiated_at,
            completedAt: download.completed_at || null,
            expiresAt: calculateExpiryTime(download.initiated_at),
            product: download.products ? {
                id: download.products.id,
                name: download.products.name,
                description: download.products.description,
                sellerId: download.products.seller_id,
                price: download.products.price
            } : null
        }
    };
};

/**
 * Format error response for download operations
 * @param {string} message - Error message
 * @returns {object} Formatted error response
 */
exports.downloadErrorResponse = (message) => {
    return {
        success: false,
        message: message || 'An error occurred during download operation'
    };
};

/**
 * Calculate expiry time for download URL (24 hours from initiation)
 * @param {string} initiatedAt - ISO timestamp of initiation
 * @returns {string} ISO timestamp of expiry
 */
const calculateExpiryTime = (initiatedAt) => {
    if (!initiatedAt) return null;

    const initiationDate = new Date(initiatedAt);
    const expiryDate = new Date(initiationDate.getTime() + 86400000); // Add 24 hours in milliseconds
    return expiryDate.toISOString();
};

/**
 * Format batch download response
 * @param {array} downloads - Array of download records
 * @returns {object} Formatted batch response
 */
exports.downloadBatchResponse = (downloads) => {
    if (!Array.isArray(downloads)) {
        return {
            success: false,
            message: 'Invalid batch download data'
        };
    }

    return {
        success: true,
        message: 'Downloads retrieved successfully',
        data: downloads.map(download => ({
            id: download.id,
            productId: download.product_id,
            fileName: download.file_name,
            fileSize: download.file_size,
            status: download.status,
            initiatedAt: download.initiated_at,
            completedAt: download.completed_at || null
        })),
        count: downloads.length
    };
};

/**
 * Format download statistics response
 * @param {object} stats - Statistics object
 * @returns {object} Formatted statistics response
 */
exports.downloadStatsResponse = (stats) => {
    return {
        success: true,
        message: 'Download statistics retrieved successfully',
        data: {
            totalDownloads: stats.totalDownloads || 0,
            completedDownloads: stats.completedDownloads || 0,
            pendingDownloads: stats.pendingDownloads || 0,
            expiredDownloads: stats.expiredDownloads || 0,
            averageFileSize: stats.averageFileSize || 0,
            lastDownloadAt: stats.lastDownloadAt || null
        }
    };
};
