const express = require('express');
const router = express.Router();
const { consumerController, authController } = require('../../controller');
const { consumerServices } = require('../../services');

// get all stock
router.post("/getAllStock", authController.requireSignin, consumerController.getAllStockController);

// add new cart
router.post("/addNewCart", authController.requireSignin, consumerController.createCartController);

// Get all active carts
router.post("/getCart", authController.requireSignin, consumerController.getCartController);

// User Add despatch address
router.post("/addAddress", authController.requireSignin, consumerController.addAddressController);

// Get User addresses
router.get("/getAddress/:id", authController.requireSignin, consumerController.getAddressController);

// manage cart
router.post("/manageCart", authController.requireSignin, consumerController.manageCartController);

// Confirm Transaction
router.post("/confirmTransaction", authController.requireSignin, consumerController.confirmTransactionController);

// Get Transaction of User
router.post("/getAllTransaction", authController.requireSignin, consumerController.getAllTransactionController);

// Get Frequently Ordered Items
router.get("/getFrequentItems/:userId", authController.requireSignin, consumerController.getFrequentItemsController);

module.exports = router;