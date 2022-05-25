const mongoose = require('mongoose');
const {Schema}= mongoose;

const DespatchSchema= new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    address: [
        { 
            type: Schema.ObjectId,
            ref: "Address",
        }
    ]    
}, {timestamps: true});

module.exports = mongoose.model("Despatch", DespatchSchema);