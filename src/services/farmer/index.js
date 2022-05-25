const userSchema = require('../../model/userModel');
const surplusSchema = require('../../model/surplusModel');
const farmSchema = require('../../model/farmModel');
const stockSchema = require('../../model/stockModel');
const addressSchema = require('../../model/addressModel');
const cartSchema = require('../../model/cartModel');
const orderSchema = require('../../model/orderModel');
const transactionSchema = require('../../model/transactionModel');

// Get Farm By Name [SERVICES]
const getFarmByNameService = async (name)=> {
    const farm = await farmSchema.findOne({name});
    try {
        if(farm){
            return{exist: true, data: farm};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting farm by name");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Get Farmer By Owner [SERVICES]
const getFarmByOwner = async (owner) => {
    try {
      const farm = await farmSchema.findOne({owner: owner}).populate("owner");
      return farm;
    } catch (error) {
      console.log(error);
    }
  };

// Create New Farm [SERVICES]
const createNewFarmService = async (farm)=> {
    try {
        const newFarm = new farmSchema(farm);        
        await newFarm.save((error, farm) => {
          if (error) {
              console.log("[ERROR] Creating new farm");
              console.log(error);
          }
          return farm;
        });
        return newFarm;
    }catch (error) {
        console.log("[EXCEPTION] Creating new farm");
    }
};

// Get surplus information as list with/without filters
const getSurplusInformationService = async(queryData)=> {
    const surplusList = await surplusSchema.find(queryData);
    try {
        if(surplusList){
            return{count: surplusList.length,data: surplusList};
        }else {
            return{count: 0,data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting surplus list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Get Stock with filter [SERVICES]
const getStockWithFilterService = async (data)=> {
    const stock = await stockSchema.findOne(data);
    try {
        if(stock){
            return{exist: true, data: stock};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting Stock with filters");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Get Stock by ID [SERVICES]
const getStockByIdService = async (id)=> {
    const stock = await stockSchema.findById(id);
    try {
        if(stock){
            return{exist: true, data: stock};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting Stock with Id");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Update Stock by ID [SERVICES]
const updateStockByIdService = async (data, id)=> {
    try {
        const updatedStock = await stockSchema.findByIdAndUpdate(id, data, {new: true,});
        return updatedStock;
    }catch(err){
        console.log("[ERROR] Updating Stock with Id");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Create New Stock [SERVICES]
const createNewStockService = async (stock)=> {
    try {
        const newStock = new stockSchema(stock);        
        await newStock.save((error, stock) => {
          if (error) {
              console.log("[ERROR] Creating new farm");
              console.log(error);
          }
          return stock;
        });
        return newStock;
    }catch (error) {
        console.log("[EXCEPTION] Creating new farm");
    }
};

// Get surplus information as list with/without filters
const getStockInformationService = async(queryData)=> {
    const stockList = await stockSchema.find(queryData).populate(["surplusId", "farmId"]);
    try {
        if(stockList){
            return{count: stockList.length,data: stockList};
        }else {
            return{count: 0,data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting stock list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Get sales orders as list with/without filters
const getTransactionService = async(queryData)=> {
    const transactionList = await transactionSchema
        .find(queryData)
        .populate(["user", "address", "orders"])
        .populate({
            path: 'orders',
            populate: { 
                path: 'cart',
                populate: { 
                    path: 'stock',
                    populate: { path: 'surplusId'}
                } 
            }
        })
        .populate({
            path: 'orders',
            populate: { path: 'farmId'}
        });

    try {
        if(transactionList){
            return{count: transactionList.length,data: transactionList};
        }else {
            return{count: 0,data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting order list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Getting Transaction By ID
const getTransactionById = async (data)=> {
    const populateList = [];
    if(data.orderPopulate === true) {
        populateList.push('orders');
    }
    if(data.userPopulate === true) {
        populateList.push('user');
    }
    if(data.addressPopulate === true) {
        populateList.push('address');
    }
    try {
        const transaction = await transactionSchema
            .findById(data.transactionId)
            .populate(populateList);
        if(transaction) {
            return {exist: true, data: transaction};
        }else {
            return {exist: false, data: {}};
        }
    }catch(err) {
        console.log("ERROR: Getting transaction by id [SERVICES]");
        console.log(err);
    }    
}

// Update Order as delivered by ID [SERVICES]
const updateOrderAsDeliveredByIdService = async (data, id)=> {
    try {
        const updatedOrder = await orderSchema.findByIdAndUpdate(id, data, {new: true,});
        return updatedOrder;
    }catch(err){
        console.log("[ERROR] Updating Order as Delivered with Id");
        console.log(error);
        return {success: false, data:{}};
    }    
};

const updateTransactionStatusService = async(id)=> {
    const transaction = await transactionSchema.findById(id).populate(['orders']);
    try {
        if(transaction) {
            const deliveredOrders = transaction.orders.reduce((prev, curr)=> {
                if(curr.delivered === true) {
                    return prev + 1;
                }else {
                    return prev + 0;
                }
            }, 0);
            if(deliveredOrders === transaction.orders.length) {
                const updatedTransaction = await transactionSchema
                    .findByIdAndUpdate(id, {completed: true}, {new: true,});
                return {status: true, data: updatedTransaction};
            }else {
                return {status: true, data: transaction};
            }
        }else {
            return {status: false, data: {}};
        }
        
    }catch(err) {
        console.log("[ERROR] Updating transaction Status");
        console.log(error);
        return {status: false, data: {}};
    }
}

module.exports = {
    getFarmByNameService,
    createNewFarmService,
    getFarmByOwner,
    getSurplusInformationService,
    getStockWithFilterService,
    createNewStockService,
    getStockInformationService,
    getStockByIdService,
    updateStockByIdService,
    getTransactionService,
    getTransactionById,
    updateOrderAsDeliveredByIdService,
    updateTransactionStatusService
}