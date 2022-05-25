const { consumerServices }= require('../../services');
const { createOrderList, createFrequentList }= require('./utils');

// Getting Stock Details [CONTROLLER]
const getAllStockController = async(req,res)=> {
    try {
        let stockBySurplusList = [];
        let queryData = {stock: { $ne: 0}};
        if(req?.body !== null) {
            if(req.body?.filterStatus === true) {
                let surplusFilterQueryData = {}
                // Implementing Filtering by name
                if(req.body?.filterByType.length > 0) {
                    surplusFilterQueryData['type'] = req.body?.filterByType;                    
                }
                if(req.body?.filterByName.length > 0) {
                    surplusFilterQueryData['name'] = req.body?.filterByName;
                }

                const filteredSurplusIdList = await consumerServices.getAllSurplusByFilters(surplusFilterQueryData);
                queryData = {
                    ...queryData,
                    $or: filteredSurplusIdList.count === 0?
                        []
                        :
                        filteredSurplusIdList.data.map((element)=> {
                            return({surplusId: element._id})
                        }),
                };
            }
            const stockList = await consumerServices.getAllStockService(queryData);
            stockList.data.forEach((element)=> {
                let surplusIndex = stockBySurplusList.findIndex((el)=> el.surplusId === element?.surplusId?._id);
                if(surplusIndex < 0) {
                    stockBySurplusList.push({
                        surplusId: element?.surplusId?._id,  
                        surplusName: element?.surplusId?.name.toLowerCase(),
                        surplusType: element?.surplusId?.type,                      
                        stock: new Array({
                            stockId: element?._id,
                            stock: element?.stock,
                            unitPrice: element?.unitPrice,
                            mediaPresent: element?.mediaPresent,
                            mediaUrl: element?.mediaUrl,
                            farm: element?.farmId,
                        })
                    })
                }else {
                    stockBySurplusList[surplusIndex].stock.push({
                        stockId: element?._id,
                        stock: element?.stock,
                        unitPrice: element?.unitPrice,
                        mediaPresent: element?.mediaPresent,
                        mediaUrl: element?.mediaUrl,
                        farm: element?.farmId,
                    })
                }
            });
            const archivedObject = {count: stockBySurplusList.length, data: stockBySurplusList};
            res.status(200).json({success: true, message: "Stocks archived to list", data: archivedObject});
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }
    }catch(error) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Creating new stock [CONTROLLER]
const createCartController = async(req,res)=> {
    if(req.Body !== null) {
        const redundancyCheckData = {
            createdBy: req.body?.createdBy,
            stock: req.body?.stockId,
            checkout: false
        };
        const cartExistsQuery = await consumerServices.getCartOfUserService(redundancyCheckData);
        if(cartExistsQuery.exist === true) {
            res.status(200)
            .json({
                success: false, 
                message: "Cart already exists", 
                data: cartExistsQuery
            });
        }
        if(cartExistsQuery.exist === false) {
            // Call to create new cart item 
            const stockDetails = await consumerServices.getStockByIdService(req.body?.stockId);
            if(stockDetails?.success === true && stockDetails.data.stock > req.body.quantity) {
                const unitPrice = stockDetails?.data?.unitPrice;
                const data = {
                    createdBy: req.body?.createdBy,
                    stock: req.body?.stockId,
                    quantity: req.body?.quantity,
                    itemCost: req.body?.quantity * unitPrice,
                    checkout: false,
                };

                const updatedStock= await consumerServices.updateStockCount({
                    stock: req.body?.stockId,
                    quantity: req.body?.quantity,
                });

                if(updatedStock.updated === true) {
                    const newcart = await consumerServices.createNewCartService(data, );
                    res.status(200).json({
                        success: true,
                        message: "New cart created", 
                        data: newcart
                    });
                }else {
                    res.status(200)
                    .json({
                        success: false, 
                        message: "Stock not updated", 
                        data: {}
                    });
                }

                
            } else {
                res.status(200)
                .json({
                    success: false, 
                    message: "Stock Information not available", 
                    data: cartExistsQuery
                });
            }          
                        
            
        }
    }else {
        res.status(200).json({success: false, message: "Request Body not present", data: {}});
    }    
}

// Getting Stock Details [CONTROLLER]
const getCartController = async(req,res)=> {
    try {
        if(req.body) {
            const cartList = await consumerServices.getCartListService(req.body);
            res.status(200).json({success: true, message: "Cart List Archived", data: cartList});
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }
    }catch(error) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Add address controller [CONTROLLER]
const addAddressController = async(req, res)=> {
    try{
        if(req.body) {            
            const newAddress = await consumerServices.createNewAddressService({
                addressLine1: req.body?.addressLine1,
                addressLine2: req.body?.addressLine2,
                city: req.body?.city,
                state: req.body?.state,
                pincode: req.body?.pincode,
            });
            let despatchInfo = {};
            const userDespatchInfo = await consumerServices.getUserDespatchService(req.body?.user);
            if(userDespatchInfo.exist === true) {
                despatchInfo = await consumerServices.updateDespatchService(
                    userDespatchInfo.data._id,
                    newAddress
                );
            }else {
                despatchInfo = await consumerServices.createNewDespatchService({
                    user: req.body?.user,
                    address: newAddress
                });
            }
            res.status(200)
            .json({success: true, message: "Address created successfully", data: despatchInfo});
        }else {
            res.status(200).json({success: false, message: "Request body not present", data: {}});
        }
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Getting user address [CONTROLLER]
const getAddressController = async(req,res)=> {
    try {        
        const userAddress = await consumerServices.getUserDespatchService(req.params.id);
        res.status(200)
        .json({
            success: true, 
            message: "User address Archived", 
            data: userAddress
        });
    }catch(error) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// manage cart [CONTROLLER]
const manageCartController = async(req, res)=> {
    try{
        if(req.body) {
            const cartUpdate = req.body?.type === "INCREMENT"? 1:-1;
            const stockUpdate = req.body?.type === "INCREMENT"? -1:1;
            // Validations 
            const stock = await consumerServices.getStockByIdService(req.body?.stockId);
            const cart = await consumerServices.getCartByIdService(req.body?.cartId);
            const count = req.body?.type === "INCREMENT"? 1: -1;
            if(stock.success === true && cart.success === true) {
                // Updating Stock
                const updatedStock = await consumerServices.updateStockCount({
                    stock: req.body?.stockId,
                    quantity: count,
                });
                if(updatedStock.updated === true) {
                    // Cart Management
                    const updatedCart = await consumerServices.updateCartCount({
                        cart: req.body?.cartId,
                        quantity: count,
                        unitPrice: stock.data.unitPrice
                    });
                    console.log("Controller");
                    console.log(updatedCart);
                    if(updatedCart.updated === true) {
                        res.status(200).json({success: true, message: "Cart Updation Success", data: updatedCart});
                    }else {
                        res.status(200).json({success: false, message: "Cart Updation Failed", data: {}});
                    }
                }else {
                    res.status(200).json({success: false, message: "Stock Updation Failed", data: {}});
                }

            }
            if(stock.exist === false) {
                res.status(200)
                .json({success: false, message: "Stock does not exist", data: {}});
            }

            if(cart.success === false) {
                res.status(200)
                .json({success: false, message: "Cart does not exist", data: {}});
            }          
            
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Confirm Transaction [CONTROLLER]
const confirmTransactionController = async(req, res)=> {
    try{
        if(req.body) {
            const user = await consumerServices.getUserByIdService(req.body?.user);
            if(user.success === true) {
                const address = await consumerServices.getAddressByIdService(req.body.selectedAddress);
                if(address.success === true) {
                    const cart = await consumerServices.getCartListService({
                        createdBy: user.data._id,
                        checkout: false
                    });
                    if(cart.count === 0) {
                        res.status(200)
                        .json({
                            success: false, 
                            message: "cart is empty", 
                            data: {}}
                        ); 
                    }else {
                        const orderList = createOrderList(cart.data);
                        const newOrders = orderList.map(async (element)=> {
                            return await consumerServices.createNewOrderService({
                                farmId: element.farm.farmId,
                                cart: element.cart.map((cartItem)=> {
                                    return cartItem.cartId
                                }),
                                delivered: false
                            });
                        });
                        // Resolving promises
                        await Promise.all(newOrders)
                        .then(async (resProm)=> {
                            console.log("Promise Resolved");
                            const newTransaction = await consumerServices.createNewTransactionService({
                                user: user.data._id,
                                address: address.data._id,
                                orders: resProm.map((item)=> {return item._id}),
                                completed: false
                            });                            
                            if(newTransaction) {
                                // Clearing cart 
                                const newCart = await consumerServices.clearCartService(user.data._id);

                                // Sending final response
                                res.status(200)
                                .json({
                                    success: true, 
                                    message: "Transaction created successfully and your cart has been cleared",
                                    data: newTransaction,
                                });  
                            }else {
                                res.status(200)
                                .json({
                                    success: false, 
                                    message: "Unable to create transaction at this time. Please try again later", 
                                    data: {}}
                                );
                            }
                        })
                        .catch((errProm)=> {
                            res.status(200)
                            .json({
                                success: false, 
                                message: "Unable to create orders at this time. Please try again later", 
                                data: {}}
                            ); 
                        })                         
                    }
                    
                }else {
                    res.status(200)
                    .json({
                        success: false, 
                        message: "Address does not exist", 
                        data: {}
                    }); 
                }
            }else {
                res.status(200)
                .json({
                    success: false, 
                    message: "User does not exist", 
                    data: {}}
                );
            }
        }else {
            res.status(200)
            .json({
                success: false, 
                message: "Request body not present", 
                data: {}}
            );
        }
    }catch(error) {
        console.log(error);
        res.status(200)
        .json({
            success: false, 
            message: "Call not acheived", 
            data: {}}
        ); 
    }
}

const getAllTransactionController= async(req, res)=> {
    try {
        if(req.body) {
            let queryData = {user: req.body?.userId};
            if(req.body?.isCompletedRequested === true) {
                queryData['completed'] = req.body?.completedStatus
            }
            
            const transactionList = await consumerServices.getAllTransactionService(queryData);
            if(transactionList) {
                res.status(200)
                .json({
                    success: true, 
                    message: "Transactions archived", 
                    data: transactionList
                }); 
            }else {
                res.status(200)
                .json({
                    success: false, 
                    message: "Unable to get transaction. Try again later", 
                    data: {}
                }); 
            }
        }else {
            res.status(200)
            .json({
                success: false, 
                message: "Request Body not present", 
                data: {}
            });   
        }
    }catch(error) {
        console.log(error);
        res.status(200)
        .json({
            success: false, 
            message: "Call not acheived", 
            data: {}
        }); 
    }
}

const getFrequentItemsController= async(req, res)=> {
    try{
        if(req.params) {
            const cartList = await consumerServices.getUserCartHistory(req.params.userId);
            if(cartList) {
                const frequentList = createFrequentList(cartList.data);
                res.status(200)
                .json({
                    success: true, 
                    message: "Call acheived", 
                    data: frequentList
                });
            }else {
                res.status(200)
                .json({
                    success: false, 
                    message: "Unable to archive list", 
                    data: {}
                });
            }
            
        }else {
            res.status(200)
            .json({
                success: false, 
                message: "Request Parameter Missing", 
                data: {}
            });  
        }
         
    }catch{
        res.status(200)
        .json({
            success: false, 
            message: "Call not acheived", 
            data: {}
        }); 
    }
}

module.exports = {
    getAllStockController,
    createCartController,
    getCartController,
    addAddressController,
    getAddressController,
    manageCartController,
    confirmTransactionController,
    getAllTransactionController,
    getFrequentItemsController
}