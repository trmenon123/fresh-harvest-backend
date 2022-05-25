const express = require('express');
const router = express.Router();
const { adminController, authController } = require('../../controller');
const { adminServices } = require('../../services');

// User Routes
// User Details
router.post("/getUserDetails", authController.requireSignin, adminController.getUserDetailsController);

// Surplus Routes
// Create new surplus
router.post("/createSurplus", authController.requireSignin, adminController.createSurplusController);

// Surplus Details with or without filters
router.post("/getSurplusDetails", authController.requireSignin, adminController.getSurplusDetailsController);

// Get Stock Details of Surplus
router.get("/getSurplusStockDetails/:surplusId", authController.requireSignin, adminController.getSurplusStockDetailsController);

// Get all transactions
// router.post("/getAllTransactions", authController.requireSignin, adminController.getAllTransactionsController);
router.post("/getAllTransactions", adminController.getAllTransactionsController);

// Get surplus statistics
router.get(
    "/getSurplusStatistics",
    // authController.requireSignin,
    adminController.getSurplusStatisticsController
)


module.exports = router;