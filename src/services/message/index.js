const userSchema = require('../../model/userModel');
const messageSchema = require('../../model/messageModel');

// Get users information as list with/without filters
const getUserDetailsService = async(userId)=> {
    const user = await userSchema.findById(userId);
    try {
        if(user){
            return {exist: true,data: user};
        }else {
            return {exist: false,data: {}};
        }
    }catch(err) {
        console.log("[ERROR] Getting users by ID: Service");
        console.log(error);
        return {exist: false, data:{}};
    }
}

// Create New Mail [SERVICES]
const createNewMessageService = async (message)=> {
    try {
        const newMessage = new messageSchema(message);
        await newMessage.save((error, message) => {
          if (error) {
              console.log("[ERROR] Creating new message");
              console.log(error);
          }
          return message;
        });
        return newMessage;
    }catch (error) {
        console.log("[EXCEPTION] Creating new mail: service");
        console.log(error);
    }
};

// Getting users by pattern search
const getUsersByPattern = async(patternText)=> {
    const userList = await userSchema.find({
        "name": { $regex: patternText, $options: 'i' }
    });
    try {
        if(userList) {
            return {
                count: userList.length,
                data: userList.map((user)=> {
                    return {value: user?._id, label: user?.name}
                })
            };
        }else {
            return {count: 0, data: {}};
        }
    }catch(error) {
        console.log("[ERROR: SERVICES] Unable to populate user list by pattern");
        console.log(error);
        return {count: 0, data: {}};
    }
}

// Getting all notifications for admin [SERVICES]
const getNotificationService = async()=> {
    const messages = await messageSchema.find({notifyAdmin: true}).populate(['fromUser', 'toUser']);
    try {
        if(messages) {
            return {count: messages.length, data: messages};
        }else {
            return {count: 0, data: {}};
        }
    }catch(err) {
        console.log("[ERROR: SERVICES] Retreiving notifications");
        console.log(err);
        return {count: 0, data: {}};
    }
}

// Getting messages [SERVICES]
const getMessagesService = async(data)=> {
    const messages = await messageSchema.find(data).populate(['fromUser', 'toUser']);
    try {
        if(messages) {
            return {count: messages.length, data: messages};
        }else {
            return {count: 0, data: {}};
        }
    }catch(err) {
        console.log("[ERROR: SERVICES] Retreiving messages");
        console.log(err);
        return {count: 0, data: {}};
    }
}

// Getting message by id [SERVICES] 
const getMessageByIdService = async (id)=> {
    const message = await messageSchema.findById(id);
    try{
        if(message) {
            return {exist: true, data: message};
        }else {
            return {exist: false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR: SERVICES] Retreiving message by ID");
        console.log(err);
        return {exist: false, data: {}};
    }
}

// Marking message as read [SERVICES]
const updateMessageService = async(id, data)=> {
    try {
        const updatedMessage = await messageSchema.findByIdAndUpdate(id,data,{new: true,});
        return updatedMessage;
    }catch(err) {
        console.log("[ERROR: SERVICES] Marking message as read by ID");
        console.log(err);
        return {};
    }
}

module.exports = {
    getUserDetailsService,
    createNewMessageService,
    getUsersByPattern,
    getNotificationService,
    getMessagesService,
    getMessageByIdService,
    updateMessageService
}