const express = require('express');
const router = express.Router();
const { authController } = require('../../controller');


// Create New User
router.post("/signup", authController.createUser);

// User Signin
router.post("/signin", authController.signin);

// User Signout
router.get("/signout", authController.signout);

module.exports = router;