const mongoose = require('mongoose');
const {Schema}= mongoose;

const MessageSchema= new Schema({
    fromUser: { type: Schema.ObjectId, ref: "User", required: true,},
    toUser: { type: Schema.ObjectId, ref: "User", required: true,},
    notifyAdmin: { type: Boolean, required: true, default: false},
    isRead: { type: Boolean, required: true, default: false},
    subject: { type: String, required: true},
    message: { type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Message", MessageSchema);