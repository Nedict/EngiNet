const downloadService = require('../services/download.service');
const { downloadResponse, downloadHistoryResponse, downloadDetailsResponse } = require('../utils/downloadResponse');
const { statusCodes } = require('../utils/statusCodes');

/**
 * Get download history for authenticated user
 * GET /api/downloads/history
 */
exports.getDownloadHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const history = await downloadService.getDownloadHistory(userId, page, limit);

        return res.status(statusCodes.OK).json(
            downloadHistoryResponse(history.data, history.pagination)
        );
    } catch (error) {
        return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get details of a specific download
 * GET /api/downloads/:downloadId
 */
exports.getDownloadDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { downloadId } = req.params;

        if (!downloadId) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Download ID is required'
            });
        }

        const downloadDetails = await downloadService.getDownloadDetails(downloadId, userId);

        return res.status(statusCodes.OK).json(
            downloadDetailsResponse(downloadDetails)
        );
    } catch (error) {
        if (error.message === 'Download not found') {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Download record not found'
            });
        }

        if (error.message === 'Unauthorized access to download') {
            return res.status(statusCodes.FORBIDDEN).json({
                success: false,
                message: 'You do not have access to this download'
            });
        }

        return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Initiate download - verify purchase and generate signed URL
 * POST /api/downloads/initiate/:productId
 */
exports.initiateDownload = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        if (!productId) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const download = await downloadService.initiateDownload(userId, productId);

        return res.status(statusCodes.CREATED).json(
            downloadResponse(download)
        );
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (error.message === 'Purchase not found') {
            return res.status(statusCodes.FORBIDDEN).json({
                success: false,
                message: 'You have not purchased this product'
            });
        }

        if (error.message === 'Payment not completed') {
            return res.status(statusCodes.FORBIDDEN).json({
                success: false,
                message: 'Payment for this product has not been completed'
            });
        }

        if (error.message === 'Product file not found') {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Product file is no longer available for download'
            });
        }

        return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Track download completion
 * POST /api/downloads/:downloadId/complete
 */
exports.trackDownloadCompletion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { downloadId } = req.params;

        if (!downloadId) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Download ID is required'
            });
        }

        const updated = await downloadService.trackDownloadCompletion(downloadId, userId);

        return res.status(statusCodes.OK).json(
            downloadResponse(updated)
        );
    } catch (error) {
        if (error.message === 'Download record not found') {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: 'Download record not found'
            });
        }

        if (error.message === 'Unauthorized access') {
            return res.status(statusCodes.FORBIDDEN).json({
                success: false,
                message: 'You do not have access to this download'
            });
        }

        return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
