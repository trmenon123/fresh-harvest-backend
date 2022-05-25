const express = require('express');
const router = express.Router();
const { assetController, authController } = require('../../controller');

// Upload Route
router.post('/upload', authController.requireSignin, assetController.uploadController);


// Serve Routes
router.get('/getStockMedia/:file',  assetController.getStockMediaController);

module.exports = router;