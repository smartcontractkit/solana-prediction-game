const { Schema, model } = require("mongoose");

// Create Schema and Model for User
const UserSchema = new Schema({
    // the user's public address on solana
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