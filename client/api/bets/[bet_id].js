const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

module.exports = async (req, res) => {

    await connectToDatabase();
        
    const bet_id = req.query.bet_id;

    try {
        const bet = await Bet.findOne({
            _id: bet_id
        })
        .populate("prediction");

        res.send(bet);
    } catch (err) {
        console.error("Failed to get bet, with error code: " + err.message);
        res.status(500).send(err);
    }

}