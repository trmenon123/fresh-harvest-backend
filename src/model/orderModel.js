const mongoose = require('mongoose');
const {Schema}= mongoose;

const OrderSchema= new Schema({
    farmId: {
        type: Schema.ObjectId,
        ref: "Farm",
    },
    cart: [
        { 
            type: Schema.ObjectId,
            ref: "Cart",
        }
    ],
    delivered: {
        type: Boolean,
        default: false
    }    
}, {timestamps: true});

module.exports = mongoose.model("Order", OrderSchema);