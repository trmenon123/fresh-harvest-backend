const authController = require('./auth');
const adminController = require('./admin');
const farmerController = require('./farmer');
const assetController = require('./asset');
const consumerController = require('./consumer');
const messageController = require('./message');

module.exports= {
    authController,
    adminController,
    farmerController,
    assetController,
    consumerController,
    messageController
};