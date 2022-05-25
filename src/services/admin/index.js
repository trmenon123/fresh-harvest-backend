const userSchema = require('../../model/userModel');
const surplusSchema = require('../../model/surplusModel');
const stockSchema = require("../../model/stockModel");
const farmSchema = require("../../model/farmModel");
const cartSchema = require("../../model/cartModel");
const transactionSchema = require("../../model/transactionModel");
const addressSchema = require('../../model/addressModel');
const despatchSchema = require('../../model/despatchModel');

// Get users information as list with/without filters
const getUsersInformationService = async(queryData)=> {
    const userList = await userSchema.find(queryData);
    try {
        if(userList){
            return{count: userList.length,data: userList};
        }else {
            return{count: 0,data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting users list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Get Surplus By Name [SERVICES]
const getSurplusByNameService = async (name)=> {
    const surplus = await surplusSchema.findOne({name});
    try {
        if(surplus){
            return{exist: true, data: surplus};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting surplus by name");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Create New Surplus [SERVICES]
const createNewSurplusService = async (surplus)=> {
    try {
        const newSurplus = new surplusSchema(surplus);
        await newSurplus.save((error, surplus) => {
          if (error) {
              console.log("[ERROR] Creating new surplus");
              console.log(error);
          }
          return surplus;
        });
        return newSurplus;
    }catch (error) {
        console.log("[EXCEPTION] Creating new surplus");
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

// Getting all stocks of surplus [SERVICES]
const getSurplusStockDetailsService = async(surplusId)=> {
    const stockList = await stockSchema
        .find({surplusId: surplusId})
        .populate(['farmId'])
        .populate({
            path: 'farmId',
            populate: { path: 'owner'}
        });
    try {
        if(stockList) {
            return {success: true, count: stockList.length, data: stockList}
        }else {
            return { success: false, count: 0, data: []}
        }
    }catch(err) {
        console.log("ERROR : Getting surplus-stock data [SERVICES] ");
        console.log(err);
    }
}

// Get all user Transaction service
const getAllTransactionService = async(data)=> {
    const transactionList = await transactionSchema
        .find(data)
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
        console.log("[ERROR] Getting transaction list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Get users information by name
const getUsersByNameService = async(name)=> {
    const user = await userSchema.findOne({name});
    try {
        if(user){
            return {success: true, data: user};
        }else {
            return {success: false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR] Getting users by name");
        console.log(error);
        return {success: false, data: {}};
    }
}

// getting count of surplus by farms
const getSurplusCountService = async(id)=> {
    const inventoryList = await stockSchema.find({surplusId: id});
    try {
        if(inventoryList) {
            return inventoryList.length;
        }else {
            return 0;
        }
    }catch(err) {
        console.log("[ERROR: SERVICES] Getting count of surplus");
        console.log(err);
        return 0;
    }
}

module.exports = {
    getUsersInformationService,
    getSurplusByNameService,
    createNewSurplusService,
    getSurplusInformationService,
    getSurplusStockDetailsService,
    getAllTransactionService,
    getUsersByNameService,
    getSurplusCountService
}