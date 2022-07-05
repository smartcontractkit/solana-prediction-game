const Moralis = require("moralis/node");

const Bet = Moralis.Object.extend("Bet");
const BetQuery = new Moralis.Query(Bet);
const Prediction = Moralis.Object.extend("Prediction");
const PredictionQuery = new Moralis.Query(Prediction);

const createBet = async (bet) => {

    const betObject = new Bet();
    
    const prediction = await PredictionQuery.get(bet.predictionId);
    
    return new Promise(async (resolve, reject) => {
      await betObject.save({
        ...bet,
        "parent": prediction
      })
      .then(
        (data) => {
          console.log("New Bet created with objectId: " + data.id);
          resolve(data);
        },
        (error) => {
          console.log("Failed to create new bet, with error: " + error.message);
        }
      );
    });
}

const retrieveBet = async (betId) => {
    const bet = await BetQuery.get(betId);    
    const prediction = bet.get("parent");
    await prediction.fetch();
    return bet
}

const retrieveUserBets = async (user) => {
    BetQuery.equalTo("user", user);

    const bets = await BetQuery.find();

    for(let i = 0; i < bets.length; i++) {
        const bet = bets[i];
        const prediction = bet.get("parent");
        await prediction.fetch();
    }

    return bets
}

module.exports = {
    createBet,
    retrieveBet,
    retrieveUserBets
}