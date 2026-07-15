const express = require('express');
const downloadController = require('../controllers/download.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Get download history for authenticated user
router.get('/history', auth, downloadController.getDownloadHistory);

// Get download details for a specific download
router.get('/:downloadId', auth, downloadController.getDownloadDetails);

// Initiate download - verify purchase and generate signed URL
router.post('/initiate/:productId', auth, downloadController.initiateDownload);

// Track download completion
router.post('/:downloadId/complete', auth, downloadController.trackDownloadCompletion);

module.exports = router;
