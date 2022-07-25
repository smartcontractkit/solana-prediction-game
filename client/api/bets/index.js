const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

module.exports = async (req, res) => {

  await connectToDatabase();

  const searchQuery  = req.body;

  try {
    const bets = await Bet.find(searchQuery).populate("prediction");
    res.send(bets);
  } catch (err) {
    console.error("Failed to get bets, with error code: " + err.message);
    res.status(500).send(err);
  }
}