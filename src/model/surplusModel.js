const mongoose = require('mongoose');
const {Schema}= mongoose;

const SurplusSchema= new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Surplus", SurplusSchema);