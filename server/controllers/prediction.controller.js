const Prediction = require("../models/prediction.model");
const { getLatestDataRound } = require("./feed.controller");

const createPrediction = async (req, res) => {
  const prediction  = req.body;

  try {
    const predictionObject = new Prediction(prediction);
    
    const result = await predictionObject.save();
    console.log(`Prediction was inserted with the _id: ${result._id}`);

    res.send(result);
  } catch (err) {
    console.error("Failed to create new prediction, with error code: " + err.message);

    res.status(500).send(err);
  } 

}

const getPredictions = async (req, res) => {
  const searchQuery  = req.body;

  try {
    const predictions = await Prediction.find(searchQuery);
    res.send(predictions);
  } catch (err) {
    console.error("Failed to get predictions, with error code: " + err.message);
    res.status(500).send(error);
  }
}

const scheduleDailyPredictions = async (req, res) => {

  const { address, pair } = req.body;
  if(!address || !pair) {
    res.status(400).send({
      message: "Address and pair are required"
    });
    return;
  }

  const latestRound = await getLatestDataRound(req, res);

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
  scheduleDailyPredictions,
  createPrediction,
  getPredictions,
}