/**
 * Download request validation schema
 * Validates request parameters and data
 */

const validateProductId = (productId) => {
    const errors = {};

    if (!productId) {
        errors.productId = 'Product ID is required';
    } else if (typeof productId !== 'string' || productId.trim() === '') {
        errors.productId = 'Product ID must be a non-empty string';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validateDownloadId = (downloadId) => {
    const errors = {};

    if (!downloadId) {
        errors.downloadId = 'Download ID is required';
    } else if (typeof downloadId !== 'string' || downloadId.trim() === '') {
        errors.downloadId = 'Download ID must be a non-empty string';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validatePagination = (page, limit) => {
    const errors = {};
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedPage) || parsedPage < 1) {
        errors.page = 'Page must be a positive integer';
    }

    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        errors.limit = 'Limit must be between 1 and 100';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        page: parsedPage,
        limit: parsedLimit
    };
};

module.exports = {
    validateProductId,
    validateDownloadId,
    validatePagination
};
