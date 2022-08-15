const { Schema, model } = require("mongoose");

// Create Schema and Model for User
const UserSchema = new Schema({
    // the user's public address on solana
    address: {
        type: String,
        unique: true,
        required: true,
    },
},{ timestamps: true });

const User = model("User", UserSchema);

module.exports = User;