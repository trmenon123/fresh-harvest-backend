const mongoose = require('mongoose');
const {Schema}= mongoose;

const CartSchema= new Schema({
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    stock: {
        type: Schema.ObjectId,
        ref: "Stock",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    itemCost: {
        type: Number,
        required: true,
    },
    checkout: {
        type: Boolean,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model("Cart", CartSchema);