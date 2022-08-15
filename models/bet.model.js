const { Schema, model } = require("mongoose");

// Create Schema and Model for Bet
const BetSchema = new Schema({
    // ref to the user who placed the bet
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    // ref to the prediction that the bet is placed on
    prediction: { 
        type: Schema.Types.ObjectId, 
        ref: 'Prediction' 
    },
    // ref to https://explorer.solana.com/tx/[transactionSignature]
    transactionSignature: {
        type: String,
        required: true,
    },
    // the amount of solana tokens for the bet
    amount: {
        type: Number,
        required: true,
    },
    // the outcome of the bet
    status: {
        type: String,
        enum: ["completed", "won", "lost", "ongoing"],
        required: true,
    },
},{ timestamps: true });

const Bet = model("Bet", BetSchema);

module.exports = Bet;