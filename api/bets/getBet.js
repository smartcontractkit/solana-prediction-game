const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

/**
 * Vercel cloud function for the getting single bet data
*/
module.exports = async (req, res) => {

    try {
        await connectToDatabase();
            
        const searchQuery  = req.query;

        // Get the bet with prediction data
        const bet = await Bet.findOne(searchQuery)
        .populate("prediction");

        res.send(bet);
    } catch (err) {
        console.error("Failed to get bet, with error code: " + err.message);
        res.status(500).send(err);
    }

}