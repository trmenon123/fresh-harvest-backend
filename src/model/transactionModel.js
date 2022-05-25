const mongoose = require('mongoose');
const {Schema}= mongoose;

const TransactionSchema= new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: Schema.ObjectId,
        ref: "Address",
        required: true,
    },
    orders: [
        { 
            type: Schema.ObjectId,
            ref: "Order",
        }
    ],
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model("Transaction", TransactionSchema);