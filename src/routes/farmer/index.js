const express = require('express');
const router = express.Router();
const { farmerController, authController } = require('../../controller');

// Farm Routes
// Create new farm
router.post("/createFarm", authController.requireSignin, farmerController.createFarmController);

// get Farm details by ownerId
router.get("/getOwnerFarm/:id", authController.requireSignin, farmerController.getFarmByOwnerController);

// Surplus Details with or without filters
router.post("/getSurplusDetails", authController.requireSignin, farmerController.getSurplusDetailsController);

// Stock Creation
router.post("/createStock", authController.requireSignin, farmerController.createStockController);

// Get Stock
router.post("/getStock", authController.requireSignin, farmerController.getStockController);

// Update Stock
router.put("/updateStock/:id", authController.requireSignin, farmerController.updateStockController);

// Getting Sales Order
router.post("/getFarmerSales", authController.requireSignin, farmerController.getFarmerSalesController);

// Updating Despatched Order Farmer
router.put("/despatchOrder", authController.requireSignin, farmerController.despatchOrderController);

module.exports = router;