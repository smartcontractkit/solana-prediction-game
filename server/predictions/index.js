const Moralis = require("moralis/node");
const dataFeed = require("../dataFeed");

const createPrediction = async (prediction) => {

  const Prediction = Moralis.Object.extend("Prediction");
  const predictionObject = new Prediction();

  return new Promise(async (resolve, reject) => {
    await predictionObject.save(prediction)
    .then(
      (data) => {
        // Execute any logic that should take place after the object is saved.
        console.log("New object created with objectId: " + data.id);
        resolve(data);
      },
      (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log("Failed to create new object, with error code: " + error.message);
      }
    );
  });
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