const { Schema, model } = require("mongoose");

// Create Schema and Model for Feed
const FeedSchema = new Schema({
    pair: {
        type: String,
        required: true,
    },
    feed: {
        type: String,
        required: true,
    },
    answerToNumber: {
        type: Number,
        required: true,
    },
    roundId: {
        type: Number,
        required: true,
    },
    observationsTS: {
        type: Date,
        required: true,
    },
    slot: {
        type: Number,
        required: true,
    }
},{ timestamps: true });

const Feed = model("Feed", FeedSchema);

module.exports = Feed;