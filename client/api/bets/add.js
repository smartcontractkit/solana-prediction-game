const { connectToDatabase } = require("../../lib/mongoose");
const { Types } = require("mongoose");
const Bet = require("../models/bet.model");
const Prediction = require("../../models/prediction.model");

module.export = async (req, res) => {
    await connectToDatabase();

    const bet = req.body;

    try {
        bet.prediction = Types.ObjectId(bet.prediction);
        bet.user = Types.ObjectId(bet.user);
        const betObject = new Bet(bet);
        
        const result = await betObject.save();
        console.log(`Bet was inserted with the _id: ${result._id}`);

        res.send(result);
    } catch (err) {
        console.error("Failed to create new bet, with error code: " + err.message);

        res.status(500).send(err);
    } 
}