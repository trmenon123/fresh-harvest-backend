const userSchema = require('../../model/userModel');
const surplusSchema = require('../../model/surplusModel');
const farmSchema = require('../../model/farmModel');
const stockSchema = require('../../model/stockModel');
const cartSchema = require('../../model/cartModel');
const despatchSchema = require('../../model/despatchModel');
const addressSchema = require("../../model/addressModel");
const transactionSchema = require('../../model/transactionModel');
const orderSchema = require("../../model/orderModel");

// Get all stocks with/without filters [SERVICE]
const getAllStockService = async(queryData)=> {
    const stockList = await stockSchema
        .find(queryData)
        .populate(["surplusId", "farmId"])
        .populate({
            path: 'farmId',
            populate: { path: 'owner' }
        });
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

// Getting all surplus with filters [SERVICE]
const getAllSurplusByFilters = async(data)=> {
    const surplusList = await surplusSchema.find(data);
    try {
        if(surplusList){
            return{count: surplusList.length,data: surplusList};
        }else {
            return{count: 0,data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting stock list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Getting cart with filters [SERVICE]
const getCartOfUserService = async(data)=> {
    const cartDetails = await cartSchema.findOne(data).populate("stock");
    try {
        if(cartDetails){
            return{exist: true, data: cartDetails};
            
        }else {
            return{exist: false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR] Getting cart detail of user");
        console.log(error);
        return {success: false, data:{}};
    }
}

// getting all carts of user
const getUserCartHistory = async(user)=> {
    const cartList = await cartSchema
        .find({createdBy: user})
        .populate("stock")
        .populate({
            path: 'stock',
            populate: { path: 'surplusId'}
        })
        .populate({
            path: 'stock',
            populate: { path: 'farmId'}
        });
    try {
        if(cartList){
            return{count: cartList.length, data: cartList};
            
        }else {
            return{count: 0, data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting cart history of user");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Get stock information by ID [SERVICE]
const getStockByIdService = async(id)=> {
    const stock = await stockSchema
        .findById(id)
        .populate(["surplusId", "farmId"])
        .populate({
            path: 'farmId',
            populate: { path: 'owner' }
        });
    try {
        if(stock){
            return {success: true, data: stock};
        }else {
            return {success: false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR] Getting stock information");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Create New Stock [SERVICES]
const createNewCartService = async (stock)=> {
    try {
        const newStock = new cartSchema(stock);        
        await newStock.save((error, stock) => {
          if (error) {
              console.log("[ERROR] Creating new stock");
              console.log(error);
          }
          return stock;
        });
        return newStock;
    }catch (error) {
        console.log("[EXCEPTION] Creating new stock");
    }
};

// Updating stock after new cart is added
const updateStockCount= async(data)=> {
    const stock = await stockSchema.findById(data.stock);
    try {
        if(stock) {
            const count = stock.stock - parseInt(data.quantity);
            const updatedStock = await stockSchema.findByIdAndUpdate(
                data.stock, 
                {stock:count}, 
                {new: true,}
            );
            console.log("Stock Updation");
            console.log(updatedStock);
            return {updated: true, data: updatedStock};            
        }else {
            return {updated: false, data: {}};  
        }
    }catch(err) {
        console.log("[SERVICES] trying to update new stock count error")
    }
}

// Getting all cart with filters [SERVICE]
const getCartListService = async(data)=> {
    const cartList = await cartSchema.find(data)
    .populate(["stock", "createdBy"])
    .populate({
        path: 'stock',
        populate: [{ path: 'farmId', populate: 'owner' }, {path: 'surplusId'}]
    });
    
    try {
        if(cartList){
            return{count: cartList.length,data: cartList};
        }else {
            return{count: 0,data: []};
        }
    }catch(err) {
        console.log("[ERROR] Getting cart list");
        console.log(error);
        return {success: false, data:{}};
    }
}

// Getting cart by Id
const getCartByIdService= async(id)=> {
    const cart =  await cartSchema.findById(id).populate("stock");
    try {
        if(cart) {
            console.log(cart);
            return {success : true, data: cart};
        }else {
            return {success : false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR- SERVICE] Fetching cart by id")
    }        
}

// Creating new address
const createNewAddressService = async (address)=> {
    try {
        const newAddress = new addressSchema(address);        
        await newAddress.save((error, address) => {
          if (error) {
              console.log("[ERROR] Creating new stock");
              console.log(error);
          }
          return address;
        });
        return newAddress;
    }catch (error) {
        console.log("[EXCEPTION] Creating new address");
    }
};

// Getting List of despatch Addresses
const getUserDespatchService = async (user)=> {
    try {
        const userDespatch = await despatchSchema.findOne({user}).populate(["user", "address"]);  
        if (userDespatch) {
            return {exist: true, data: userDespatch};
        }else {
            return {exist: false, data: {}};
        }
    }catch (error) {
        console.log("[EXCEPTION] Creating new address");
        console.log(error);
    }
};

// Creating new despatch
const createNewDespatchService = async (data)=> {
    try {
        const newDespatch = new despatchSchema(data);        
        await newDespatch.save((error, despatch) => {
          if (error) {
              console.log("[ERROR] Creating new stock");
              console.log(error);
          }
          return despatch;
        });
        return newDespatch;
    }catch (error) {
        console.log("[EXCEPTION] Creating new despatch");
    }
};

// Updating despatch despatch
const updateDespatchService = async (id, data)=> {
    try {
        const updatedDespatch = await despatchSchema.findByIdAndUpdate(
            id,
            { $push: { address: data } },
        );
        return updatedDespatch;
    }catch (error) {
        console.log("[EXCEPTION] pushing  new despatch address");
    }
};

// Updating stock after cart is managed
const updateCartCount= async(data)=> {
    console.log("SERVICES");
    console.log(data);
    const cart = await cartSchema.findById(data.cart);
    try {
        if(cart) {
            const count = cart.quantity + parseInt(data.quantity);
            const itemPrice = count * parseInt(data.unitPrice);
            const updationObject = {
                quantity:count, 
                itemCost: itemPrice
            };
            const updatedCart = await cartSchema.findByIdAndUpdate(
                data.cart, 
                updationObject, 
                {new: true,}
            )
            .populate(["stock", "createdBy"])
            .populate({
                path: 'stock',
                populate: [{ path: 'farmId', populate: 'owner' }, {path: 'surplusId'}]
            });
            console.log("Cart Updation");
            console.log(updatedCart);
            return {updated: true, data: updatedCart};            
        }else {
            return {updated: false, data: {}};  
        }
    }catch(err) {
        console.log("[SERVICES] trying to update new cart count error")
    }
}

// Getting user by Id
const getUserByIdService= async(id)=> {
    const user = await userSchema.findById(id);
    try {
        if(user) {
            return {success : true, data: user};
        }else {
            return {success : false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR- SERVICE] Fetching user by id");
    }        
}

// Getting address by Id
const getAddressByIdService= async(id)=> {
    const address = await addressSchema.findById(id);
    try {
        if(address) {
            return {success : true, data: address};
        }else {
            return {success : false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR- SERVICE] Fetching address by id");
    }        
}

// Creating new order
const createNewOrderService = async (order)=> {
    try {
        console.log("[SERVICES ORDER]");
        console.log(order);
        const newOrder = new orderSchema(order);        
        await newOrder.save((error, order) => {
          if (error) {
              console.log("[ERROR] Creating new order");
              console.log(error);
          }
          return order;
        });
        return newOrder;
    }catch (error) {
        console.log("[EXCEPTION] Creating new order");
    }
};

// Creating new transaction
const createNewTransactionService = async (transaction)=> {
    try {
        const newTransaction = new transactionSchema(transaction);        
        await newTransaction.save((error, transaction) => {
          if (error) {
              console.log("[ERROR] Creating new transaction");
              console.log(error);
          }
          return transaction;
        });
        return newTransaction;
    }catch (error) {
        console.log("[EXCEPTION] Creating new transaction");
    }
};

// Clearing Cart
const clearCartService = async(userId)=> {
    try{
        const result = await cartSchema.updateMany(
            {createdBy: userId},
            {checkout: true},
            {multi:true}
        );
        return result.acknowledged;
    }catch(err) {
        console.log("[ERROR] Trying to clear carts");
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

module.exports = {
    getAllStockService,
    getAllSurplusByFilters,
    getCartOfUserService,
    getStockByIdService,
    createNewCartService,
    getCartListService,
    updateStockCount,
    getCartByIdService,
    createNewAddressService,
    getUserDespatchService,
    createNewDespatchService,
    updateDespatchService,
    updateCartCount,
    getUserByIdService,
    getAddressByIdService,
    createNewOrderService,
    createNewTransactionService,
    clearCartService,
    getAllTransactionService,
    getUserCartHistory
}