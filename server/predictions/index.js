const dataFeed = require("../dataFeed");
const Prediction = require("../models/predictions");

const createPrediction = async (res, prediction) => {

  try {
    const predictionObject = new Prediction(prediction);
    
    const result = await predictionObject.save();
    console.log(`Prediction was inserted with the _id: ${result._id}`);

    res.send(result);
  } catch (err) {
    console.error("Failed to create new object, with error code: " + err.message);

    res.status(500).send(err);
  } 

}

const addPredictionsDaily = async (address, pair) => {
  const latestRound = await dataFeed.getLatestDataRound(address, pair);

  const { answerToNumber, feed, observationsTS } = latestRound;

  var date = new Date();

  const predictionData = {
    owner: process.env.OWNER_PUBLIC_ADDRESS,
    account: feed,
    pair,
    prediction: null,
    expiryTime: null,
    predictionDeadline: null,
    openingPredictionPrice: answerToNumber,
    openingPredictionTime: observationsTS,
    status: true,
  };

  const plusOnePercent = await createPrediction({
    ...predictionData,
    prediction: latestRound.answerToNumber * 1.01,
    expiryTime: new Date(date.setDate(date.getDate() + 1)),
    predictionDeadline: new Date(date.setDate(date.getHours() + 1)),
  });
  const minusOnePercent = await createPrediction({
    ...predictionData,
    prediction: latestRound.answerToNumber * 0.99,
    expiryTime: new Date(date.setDate(date.getDate() + 1)),
    predictionDeadline: new Date(date.setDate(date.getHours() + 1)),
  });

  return [plusOnePercent, minusOnePercent];
}

module.exports = {
  addPredictionsDaily,
  createPrediction,
}