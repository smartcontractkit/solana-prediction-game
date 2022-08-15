const { Schema, model } = require("mongoose");

// Create Schema and Model for Prediction
const PredictionSchema = new Schema({
    // ref to the user who placed the prediction
    owner: {
        type: String,
        required: true,
    },
    // feed address on solana of the token pair
    account: {
        type: String,
        required: true,
    },
    // the token pair that the prediction is for
    pair: {
        type: String,
        required: true,
    },
    // the outcome of the prediction
    predictionPrice: {
        type: Number,
        required: true,
    },
    // the outcome of the prediction upwards or downwards
    direction: {
        type: Boolean,
        required: true,
    },
    //  the return of investment i.e 2x or 3x
    ROI: {
        type: Number,
        required: true,
    },
    // the price of the token pair from the round
    openingPredictionPrice: {
        type: Number,
        required: true,
    },
    // the time of the token pair from the round
    openingPredictionTime: {
        type: Date,
        required: true,
    },
    // the slot number of the token pair from the round
    openingPredictionSlot: {
        type: Number,
        required: true,
    },
    // the round id of the token pair from the round
    openingPredictionRoundId: {
        type: Number,
        required: true,
    },
    // the last time one is allowed to place a bet on this prediction
    predictionDeadline: {
        type: Date,
        required: true,
    },
    // the time the prediction is resolved and the outcome is known
    expiryTime: {
        type: Date,
        required: true,
    },
},{ timestamps: true });

const Prediction = model("Prediction", PredictionSchema);

module.exports = Prediction;