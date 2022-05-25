const authServices = require('./auth');
const adminServices = require('./admin');
const farmerServices = require('./farmer');
const consumerServices = require('./consumer');
const messageService = require('./message');

module.exports= {
    authServices,
    adminServices,
    farmerServices,
    consumerServices,
    messageService
};