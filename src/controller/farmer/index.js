const { farmerServices }= require('../../services');
const { createTransactionOrderList } = require('./utils');

// Create Farm [CONTROLLER]
const createFarmController = async (req,res)=> {
    const farmQuery = await farmerServices.getFarmByNameService(req?.body?.farmName);
    try{
        if(farmQuery?.exist== true) {
            res.status(200).json({
                success: true,
                status: false, 
                message:"farm name already Exist", 
                data: farmQuery?.data
            });            
        }
        if(farmQuery?.exist== false) {
            // Call to create new user            
            const data = {
                name: req.body?.farmName,
                owner: req.body?.ownerId,
            };            
            const newFarm = await farmerServices.createNewFarmService(data);
            res.status(200).json({
                success: true,
                status: true, 
                message: "New farm created", 
                data: newFarm
            });
        }
    }catch(err){
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
};

// Get Farm By Owner
const getFarmByOwnerController = async(req, res)=> {
    try {
        const farmDetails = await farmerServices.getFarmByOwner(req.params.id);
        if(!farmDetails) {
            res.status(200).json({success: false, message: "No farms recorded", data: {}});
        }else {
            res.status(200).json({success: true, message: "Farm details archived", data: farmDetails});
        }
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Getting Surplus Details [CONTROLLER]
const getSurplusDetailsController = async(req,res)=> {
    try {
        let queryData = {};
        if(req?.body !== null) {
            if(req?.body?.filterStatus === true) {
                if(req?.body?.filterByType.length !== 0) {
                    queryData["type"]= req?.body?.filterByType;
                }
            }
            const surplusList = await farmerServices.getSurplusInformationService(queryData);
            res.status(200).json({success: true, message: "Surplus archived to list", data: surplusList});
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }        
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Creating new stock [CONTROLLER]
const createStockController = async(req,res)=> {
    if(req.Body !== null) {
        const redundancyCheckData = {
            surplusId: req.body?.surplusId,
            farmId: req.body?.farmId
        };
        const stockExistsQuery = await farmerServices.getStockWithFilterService(redundancyCheckData);
        if(stockExistsQuery.exist === true) {
            res.status(200).json({success: false, message: "Stock already exists", data: {}});
        }
        if(stockExistsQuery.exist === false) {
            // Call to create new user            
            const data = {
                surplusId: req.body?.surplusId,
                farmId: req.body?.farmId,
                stock: req.body?.stock,
                unitPrice: req.body?.unitPrice,
                mediaPresent: req.body?.mediaPresent,
                mediaUrl: req.body?.mediaUrl
            };            
            const newStock = await farmerServices.createNewStockService(data);
            res.status(200).json({
                success: true,
                status: true, 
                message: "New stock created", 
                data: newStock
            });
        }
    }else {
        res.status(200).json({success: false, message: "Request Body not present", data: {}});
    }    
}

// Getting Stock Details [CONTROLLER]
const getStockController = async(req,res)=> {
    try {
        let queryData = {};
        if(req?.body !== null) {
            if(req?.body?.filterStatus === true) {
                if(req?.body?.filterStockEmpty=== true) {
                    queryData["stock"]= 0;
                }else {
                    queryData["stock"]= { $ne: 0};
                }
            }
            queryData["farmId"] = req.body?.farmId;
            const stockList = await farmerServices.getStockInformationService(queryData);
            res.status(200).json({success: true, message: "Stock archived to list", data: stockList});
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }        
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Getting Stock Details [CONTROLLER]
const updateStockController = async(req,res)=> {
    const id = req.params.id;
    try {
        // Validation to check if stock exist
        const stockExistsQuery = await farmerServices.getStockByIdService(id); 
        if(stockExistsQuery.exist === false) {
            res.status(200).json({success: false, message: "Stock does not exist", data: {}});
        }

        if(stockExistsQuery.exist === true) {
            if(req?.body !== null) {                
                const updateData = {
                    stock: req.body?.stock, 
                    unitPrice: req.body?.unitPrice,
                    mediaPresent: req.body?.mediaPresent,
                    mediaUrl: req.body?.mediaUrl
                };
                const updatedStock = await farmerServices.updateStockByIdService(updateData, id);
                res.status(200).json({success: true, message: "Stock updated", data: updatedStock});
            }else {
                res.status(200).json({success: false, message: "Request Body not present", data: {}});
            }            
        }     
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// getting SalesOrder [CONTROLLER]
const getFarmerSalesController = async(req, res)=> {
    try {
        if(req.body) {
            const farm = await farmerServices.getFarmByOwner(req.body.userId);
            if(farm) {
                const requestData = {completed: req.body.isDelivered};
                const transactionList = await farmerServices.getTransactionService(requestData);
                const exportData = createTransactionOrderList(farm?._id, transactionList.data);
                res.status(200).json({success: true, message: "Order Archived", data: exportData});
            }else {
                res.status(200).json({success: false, message: "Farm does not exist", data: {}}); 
            }            
        }else {
            res.status(200).json({success: false, message: "Req Body not present", data: {}});
        }
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Despatching Order and setting order as delivered [CONTROLLER]
const despatchOrderController = async(req, res)=> {
    try {
        if(req.body) {
            const transactionQuery = {
                transactionId : req.body?.transactionId,
                orderPopulate: true,
                userPopulate: false,
                addressPopulate: false,
            };
            const transaction = await farmerServices
                .getTransactionById(transactionQuery);
            if(transaction.exist === true) {
                if(
                    transaction.data.orders.some(
                        (order)=>order._id.toString() === req.body?.orderId.toString()
                    )
                ) {
                    // Update Order
                    const orderUpdateData = {delivered: true};
                    const updatedOrder = await farmerServices
                        .updateOrderAsDeliveredByIdService(
                            orderUpdateData,
                            req.body?.orderId
                        );
                    // Check and update Transaction
                    if(updatedOrder) {
                        const updatedTransaction = await farmerServices
                            .updateTransactionStatusService(transaction.data._id);
                        res
                        .status(200)
                        .json({
                            success: true, 
                            message: "Order has been despatched successfully",
                            data: updatedTransaction
                        });
                    }else {
                        res
                        .status(200)
                        .json({
                            success: true, 
                            message: "Order not updated",
                            data: {}
                        });
                    }                    
                }else {
                    res
                    .status(200)
                    .json({
                        success: true, 
                        message: "Order not Present in transaction",
                        data: {}
                    });
                }
                
            }else {
                res
                .status(200)
                .json({success: false, message: "Transaction does not exist", data: {}});
                }
            
        }else {
            res
            .status(200)
            .json({success: false, message: "Request Body not present", data: {}});
        }
    }catch(err) {
        console.log("ERROR: Caught Exception in DespatchOrderController");
        res
        .status(200)
        .json({success: false, message: "Call not acheived", data: {}});
    }
}

module.exports = {
    createFarmController,
    getFarmByOwnerController,
    getSurplusDetailsController,
    createStockController,
    getStockController,
    updateStockController,
    getFarmerSalesController,
    despatchOrderController
}