const { Schema, model } = require("mongoose");

const BetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    prediction: { 
        type: Schema.Types.ObjectId, 
        ref: 'Prediction' 
    },
    transactionSignature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["completed", "won", "lost", "ongoing"],
        required: true,
    },
},{ timestamps: true });

const Bet = model("Bet", BetSchema);

module.exports = Bet;