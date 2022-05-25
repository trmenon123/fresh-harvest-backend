const authRouter = require('./auth');
const adminRouter = require('./admin');
const farmerRouter = require('./farmer');
const assetRouter = require('./asset');
const consumerRouter = require('./consumer');
const messageRouter = require('./message');

module.exports= {
    authRouter,
    adminRouter,
    farmerRouter,
    assetRouter,
    consumerRouter,
    messageRouter
};