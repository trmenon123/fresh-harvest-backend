const { messageService }= require('../../services');

// Creating new message [CONTROLLER]
const sendMessageController = async(req,res)=> {
    try {
        if(req.body) {
            const fromUser = await messageService.getUserDetailsService(req.body?.fromUser);
            if(fromUser?.exist === true) {
                const toUser = await messageService.getUserDetailsService(req.body?.toUser);
                if(toUser?.exist === true) {
                    const data = {
                        fromUser: fromUser?.data?._id,
                        toUser: toUser?.data?._id,
                        notifyAdmin: req.body?.notifyAdmin || false,
                        isRead: false,
                        subject: req.body?.subject || "Unnamed Subject",
                        message: req.body?.message || "Empty mail",
                    };
                    const newMessage = await messageService.createNewMessageService(data);
                    res
                    .status(200)
                    .json({
                        success: true, message: "Your message has been send", data: newMessage
                    }); 
                }else {
                    res
                    .status(200)
                    .json({
                        success: false, message: "Recepient does not exist", data: {}
                    }); 
                }
            }else {
                res
                .status(200)
                .json({
                    success: false, message: "Registered-Account not available", data: {}
                }); 
            }
        }else {
            res.status(200).json({success: false, message: "Request body not present", data: {}});
        }
        
        
    }catch(err) {
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Populate users by pattern [CONTROLLER]
const getUsersByPatternController = async(req, res)=> {
    try {
        if(req.params && req.params.pattern) {
            const users = await messageService.getUsersByPattern(req.params.pattern);
            res.status(200).json({
                success: true, 
                message: "User List specific to your query has been archived ", 
                data: users
            });
        }else {
            res.status(200).json({success: false, message: "Pattern to check missing", data: {}});
        }
    }catch(err) {
        console.log("[ERROR: CONTROLLER] Trying to populate users by pattern");
        console.log(err);
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// Retreive Messages [CONTROLLER]
const getMessagesController = async(req, res)=> {
    try{
        if(req.body) {
            if(req.body?.isNotification === true) {
                const notifications = await messageService.getNotificationService();
                res.status(200).json({
                    success: true, message: "Notifications archived", data: notifications
                });
            }else {
                let data = {};
                if(req.body?.isReceived === true) {
                    data['toUser'] = req.body?.user;
                }else {
                    data['fromUser'] = req.body?.user;
                }
                const messages = await messageService.getMessagesService(data);
                res.status(200).json({
                    success: true, message: "Messages archived", data: messages
                });
            }            
        } else {
            res.status(200).json({
                success: false, message: "Request body not present", data: {}
            });
        }
    }catch(err) {
        console.log("[ERROR:CONTROLLER] Getting messages");
        console.log(err);
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
}

// getting message by id[CONTROLLER]
const getMessageByIdController = async (req, res)=> {
    try {
        if(req.body) {
            const message = await messageService.getMessageByIdService(req.body?.messageId);
            if(message?.exist === true) {
                if(
                    req.body?.isRecepient === true &&
                    message?.data?.isRead === false
                ) {
                    const updatedMessage = await messageService.updateMessageService(
                        message?.data?._id,
                        {isRead: true}
                    );
                    res.status(200).json({
                        success: true,
                        message: "Message retreived",
                        data: updatedMessage
                    });
                }else {
                    res.status(200).json({
                        success: true,
                        message: "Message retreived",
                        data: message?.data
                    });
                }
            }else {
                res.status(200).json({
                    success: false,
                    message: "Message does not exist",
                    data: {}
                });
            }
        }else {
            res.status(200).json({
                success: false,
                message: "Request bod not present",
                data: {}
            });
        }
    }catch(err) {
        console.log("[ERROR: CONTROLLER] Getting message by id");
        conssole.log(err);
        res.status(200).json({
            success: false,
            message: "Call not acheived",
            data: {}
        });
    }
}

module.exports= {
    sendMessageController,
    getUsersByPatternController,
    getMessagesController,
    getMessageByIdController
}