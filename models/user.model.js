const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    address: {
        type: String,
        unique: true,
        required: true,
    },
},{ timestamps: true });

const User = model("User", UserSchema);

module.exports = User;