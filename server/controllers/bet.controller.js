const { Types } = require("mongoose");
const Bet = require("../models/bet.model");

const createBet = async (req, res) => {
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

const getBet = async (req, res) => {
  const betId = req.params.betId;

  try {
    const bet = await Bet.findOne({
      _id: betId
    })
    .populate("prediction");

    res.send(bet);
  } catch (err) {
    console.error("Failed to get bet, with error code: " + err.message);
    res.status(500).send(err);
  }
}

const getBets = async (req, res) => {
  const searchQuery  = req.body;

  try {
    const bets = await Bet.find(searchQuery).populate("prediction");
    res.send(bets);
  } catch (err) {
    console.error("Failed to get bets, with error code: " + err.message);
    res.status(500).send(err);
  }
}

module.exports = {
    createBet,
    getBet,
    getBets
}