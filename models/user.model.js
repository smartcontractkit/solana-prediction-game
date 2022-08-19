const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    address: {
        type: String,
        unique: true,
        required: true,
    },
    winRate: {
        type: Number,
        default: 0,
    },
    wonTotalBets:{
        type: Number,
        default: 0,
    },
    totalBets: {
        type: Number,
        default: 0,
    },
},{ timestamps: true });

const User = model("User", UserSchema);

module.exports = User;