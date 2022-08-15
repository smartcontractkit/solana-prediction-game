const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

/**
 * Vercel cloud function for getting bet data based on query params
*/
module.exports = async (req, res) => {

  try {
    await connectToDatabase();
  
    const searchQuery  = req.query;

    // Get the bet with prediction data from latest to oldest
    const bets = await Bet.find(searchQuery).sort('-createdAt').populate("prediction");
    res.send(bets);
  } catch (err) {
    console.error("Failed to get bets, with error code: " + err.message);
    res.status(500).send(err);
  }
}