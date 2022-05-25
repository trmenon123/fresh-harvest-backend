const mongoose = require('mongoose');
const {Schema}= mongoose;

const FarmSchema= new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
      },
}, {timestamps: true});

module.exports = mongoose.model("Farm", FarmSchema);