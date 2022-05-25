const express = require('express');
const router = express.Router();
const { messageController, authController } = require('../../controller');

// Populate users with pattern
router.get(
    "/getUsersByPattern/:pattern",
    authController.requireSignin,
    messageController.getUsersByPatternController
);

// Send message
router.post(
    "/sendMessage",
    authController.requireSignin,
    messageController.sendMessageController
);

// Retreive Messages
router.post(
    "/getMessages",
    authController.requireSignin,
    messageController.getMessagesController
);

// Retreive message by id
router.post(
    "/getMessageById",
    authController.requireSignin,
    messageController.getMessageByIdController
);


module.exports = router;