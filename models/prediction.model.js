const { Schema, model } = require("mongoose");

const PredictionSchema = new Schema({
    owner: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    pair: {
        type: String,
        required: true,
    },
    predictionPrice: {
        type: Number,
        required: true,
    },
    ROI: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    openingPredictionPrice: {
        type: Number,
        required: true,
    },
    openingPredictionTime: {
        type: Number,
        required: true,
    },
    predictionDeadline: {
        type: Date,
        required: true,
    },
    expiryTime: {
        type: Date,
        required: true,
    },
},{ timestamps: true });

const Prediction = model("Prediction", PredictionSchema);

module.exports = Prediction;