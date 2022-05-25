const mongoose = require('mongoose');
const {Schema}= mongoose;

const StockSchema= new Schema({
    surplusId: {
        type: Schema.ObjectId,
        ref: "Surplus",
        required: true,
    },
    farmId: {
        type: Schema.ObjectId,
        ref: "Farm",
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    mediaPresent: {
        type: Boolean,
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model("Stock", StockSchema);