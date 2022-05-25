const { adminServices }= require('../../services');

// Getting User Details [CONTROLLER]
const getUserDetailsController = async(req,res)=> {
    try {
        let queryData = {};
        if(req?.body !== null) {
            if(req?.body?.filterStatus === true) {
                if(req?.body?.filterByName.length !== 0) {
                    queryData["name"]= req?.body?.filterByName;
                }
                if(req?.body?.filterByEmail.length !== 0) {
                    queryData["email"]= req?.body?.filterByEmail;
                }
                if(req?.body?.filterByRole.length !== 0) {
                    queryData["role"]= req?.body?.filterByRole;
                }
            }
            const userList = await adminServices.getUsersInformationService(queryData);
            res.status(200).json({success: true, message: "Users archived to list", data: userList});
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }        
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Create Surplus [CONTROLLER]
const createSurplusController = async (req,res)=> {
    const surplusQuery = await adminServices.getSurplusByNameService(req?.body?.surplusName);
    try{
        if(surplusQuery?.exist== true) {
            res.status(200).json({
                success: true,
                status: false, 
                message:"Surplus already Exist", 
                data: surplusQuery?.data
            });            
        }
        if(surplusQuery?.exist== false) {
            // Call to create new user            
            const data = {
                name: req.body?.surplusName,
                type: req.body?.surplusType,
            };            
            const newSurplus = await adminServices.createNewSurplusService(data);
            res.status(200).json({
                success: true,
                status: true, 
                message: "New surplus created", 
                data: newSurplus
            });
        }
    }catch(err){
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
};

// Getting Surplus Details [CONTROLLER]
const getSurplusDetailsController = async(req,res)=> {
    try {
        let queryData = {};
        if(req?.body !== null) {
            if(req?.body?.filterStatus === true) {
                if(req?.body?.filterByName.length !== 0) {
                    queryData["name"]= req?.body?.filterByName;
                }
                if(req?.body?.filterByType.length !== 0) {
                    queryData["type"]= req?.body?.filterByType;
                }
            }
            const surplusList = await adminServices.getSurplusInformationService(queryData);
            res.status(200).json({success: true, message: "Surplus archived to list", data: surplusList});
        }else {
            res.status(200).json({success: false, message: "Request Body not present", data: {}});
        }        
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Getting Stock details of surplus [CONTROLLER]
const getSurplusStockDetailsController = async (req, res)=> {    
    try{
        if(req.params.surplusId) {
            const stockDetails = await adminServices
                .getSurplusStockDetailsService(req.params.surplusId);
            if(stockDetails.success === true) {
                res
                .status(200)
                .json({
                    success: true, 
                    message: "All stock details archived",
                    request: req.params.surplusId, 
                    data: stockDetails.data
                });
            }else {
                res
                .status(200)
                .json({
                    success: false, 
                    message: "Unable to fetch at the moment", 
                    request: req.params.surplusId,
                    data: []
                }); 
            }
            
        }else {
            res
            .status(200)
            .json({
                success: false, 
                message: "Surplus Id not present", 
                request: req.params.surplusId,
                data: {}
            });
        }
    }catch(err) {
        console.log(err);
        res.status(200).json({success: false, message: "Call not acheived", request: '', data: {}});  
    }
}

// getting all transactions [CONTROLLER]
const getAllTransactionsController = async(req, res)=> {
    try {
        if(req.body) {
            let queryData = {};
            if(req.body?.filterStatus === true) {
                if(req.body?.filterByUser.length !== 0) {
                    const user = await adminServices.getUsersByNameService(req.body?.filterByUser);
                    if(user?.success === true) {
                        queryData['user'] = user?.data._id;
                    }                    
                }
                if(req.body?.statusRequested === true) {
                    queryData['completed'] = req.body?.isCompleted;
                }
            }
            // Service call
            const transactions = await adminServices.getAllTransactionService(queryData);
            if(transactions) {
                res
                .status(200)
                .json({
                    success: true, 
                    message: "All transactions archived", 
                    data: transactions
                });   
            }else {
                res
            .status(200)
            .json({success: false, message: "Unable to fetch data", data: {}});  
            }
        }else {
            res
            .status(200)
            .json({success: false, message: "request Body not present", data: {}});  
        }
    }catch(err) {
        console.log("ERROR: Trying to get all transactions [CPONTROLLER]");
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// getting surplus statistics [CONTROLLER]
const getSurplusStatisticsController = async (req, res)=> {
    try{
        const surplusList = await adminServices.getSurplusInformationService({});
        if(surplusList?.count !== 0) {
            const surplusReferenceList = await surplusList?.data.map(async (element)=> {
                return {
                    surplusId: element?._id,
                    surplusName: element?.name,
                    count: await adminServices.getSurplusCountService(element?._id)
                }
            });
            await Promise.all(surplusReferenceList)
            .then((responseObject)=> {
                res.status(200).json({
                    success: true,
                    message: "surplus inventory count obtained and archived",
                    data: responseObject
                });
            }).catch((errorObject)=> {
                res.status(200).json({
                    success: true,
                    message: "No surplus available at the moment. try again later",
                    data: []
                });
            });
            
        }else {
            res.status(200).json({
                success: true,
                message: "No surplus available",
                data: []
            });
        }        
        
    }catch(err) {
        console.log("[ERROR: CONTROLLER] getting surplus statistics");
        console.log(err);
        res.status(200).json({
            success: false,
            message: "Call not acheived",
            data: {}
        });
    }
}

module.exports= {
    getUserDetailsController,
    createSurplusController,
    getSurplusDetailsController,
    getSurplusStockDetailsController,
    getAllTransactionsController,
    getSurplusStatisticsController
}