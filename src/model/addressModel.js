const mongoose = require('mongoose');
const {Schema}= mongoose;

const AddressSchema= new Schema({
    addressLine1: {
        type: String,
        required: true
    }, 
    addressLine2: {
        type: String,
        required: true
    }, 
    city: {
        type: String,
        required: true
    }, 
    state: {
        type: String,
        required: true
    }, 
    pincode: {
        type: Number,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model("Address", AddressSchema);