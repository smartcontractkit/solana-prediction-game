const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const provider = anchor.AnchorProvider.env();

async function getSolanaFeed(io, feed){
  anchor.setProvider(provider);

  const CHAINLINK_FEED_ADDRESS = feed.feedAddress; 
  const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
  const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);

  //load the data feed account
  let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
  let listener = null;

  //listen for events agains the price feed, and grab the latest rounds price data
  listener = dataFeed.onRound(feedAddress, (event) => {
    const eventData = {
      pair: feed.pair,
      feed: event.feed,
      answer: event.answer,
      answerToNumber: event.answer.toNumber(),
      roundId: event.roundId,
      observationsTS: event.observationsTS,
      slot: event.slot,
    };
    console.log(`Received event ${feed.feedAddress}: ${eventData.answerToNumber}`);
    io.in(feed.feedAddress).emit('receive_data_feed', eventData); 
  });
}

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  }
});

io.on('connection', (socket) => {
  socket.on('request_data_feed', (feed) => {
    console.log(`feedAddress: ${feed.feedAddress}`);
    console.log(`User Id: ${socket.client.id}`);
    socket.join(feed.feedAddress);
    getSolanaFeed(io, feed);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

getLatestDataRound = async (address, pair) => {
  let round = null;
  anchor.setProvider(provider);

  const CHAINLINK_FEED_ADDRESS = address; 
  const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
  const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);

  //load the data feed account
  let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
  let listener = null;

  //listen for events agains the price feed, and grab the latest rounds price data
  return new Promise((resolve, reject) => {
    listener = dataFeed.onRound(feedAddress, (event) => {
      round = {
        pair: pair,
        feed: address,
        answer: event.answer,
        answerToNumber: event.answer.toNumber(),
        roundId: event.roundId,
        observationsTS: event.observationsTS,
        slot: event.slot,
      };
      if((round ?? undefined) !== undefined) {
        console.log(`Received event ${address}: ${round.answerToNumber}`);
        provider.connection.removeOnLogsListener(listener);
        resolve(round);
      }
    });
  });

}

app.get('/getLatestDataRound', async (req, res) => {
  const { address, pair } = req.body;
  let latestRound = await getLatestDataRound(address, pair);
  res.send(latestRound);
});

const Moralis = require("moralis/node");

/* Moralis init code */
const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;

createPrediction = async (prediction) => {

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

app.post('/addPrediction', async (req, res) => {
  const prediction  = req.body;

  await Moralis.start({ serverUrl, appId, masterKey });
  
  const predictionData = await createPrediction({
    ...prediction,
    expiryTime: new Date(prediction.expiryTime),
    predictionDeadline: new Date(prediction.predictionDeadline),
    openingPredictionTime: new Date(prediction.openingPredictionTime),
  });

  res.send(predictionData);
});

addPredictionsDaily = async (address, pair) => {
  let latestRound = await getLatestDataRound(address, pair);

  const { answerToNumber, feed, observationsTS } = latestRound;

  var date = new Date();

  let predictionData = {
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

  let plusOnePercent = await createPrediction({
    ...predictionData,
    prediction: latestRound.answerToNumber * 1.01,
    expiryTime: new Date(date.setDate(date.getDate() + 1)),
    predictionDeadline: new Date(date.setDate(date.getHours() + 1)),
  });
  let minusOnePercent = await createPrediction({
    ...predictionData,
    prediction: latestRound.answerToNumber * 0.99,
    expiryTime: new Date(date.setDate(date.getDate() + 1)),
    predictionDeadline: new Date(date.setDate(date.getHours() + 1)),
  });

  return [plusOnePercent, minusOnePercent];
}

app.get('/scheduleDailyPredictions', async (req, res) => {
  const { address, pair } = req.body;
  await Moralis.start({ serverUrl, appId, masterKey });
  const predictions = await addPredictionsDaily(address, pair)
  res.send(predictions);
});
