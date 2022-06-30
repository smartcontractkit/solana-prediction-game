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

createPrediction = async (latestRound, predictionData, expiryTime, predictionDeadline) => {

  const Prediction = Moralis.Object.extend("Prediction");
  const prediction = new Prediction();
  const { pair, answerToNumber, feed, observationsTS } = latestRound;

  return new Promise(async (resolve, reject) => {
    await prediction.save({
      owner: "6hvdYCWxFH3bQHKAjXeheUee1HJbp382kQzySwd8LpRk",
      account: feed,
      pair,
      prediction: predictionData,
      expiryTime,
      predictionDeadline,
      openingPredictionPrice: answerToNumber,
      openingPredictionTime: observationsTS,
      status: true,
    })
    .then(
      (prediction) => {
        // Execute any logic that should take place after the object is saved.
        console.log("New object created with objectId: " + prediction.id);
        resolve(prediction.id);
      },
      (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log("Failed to create new object, with error code: " + error.message);
      }
    );
  });
}

addPredictionsDaily = async (address, pair) => {
  let latestRound = await getLatestDataRound(address, pair);

  var date = new Date();
  let plusOnePercent = await createPrediction(
    latestRound, 
    latestRound.answerToNumber * 1.01,
    new Date(date.setDate(date.getDate() + 1)),
    new Date(date.setDate(date.getHours() + 1)),
  );
  let minusOnePercent = await await createPrediction(
    latestRound, 
    latestRound.answerToNumber * 0.99,
    new Date(date.setDate(date.getDate() + 1)),
    new Date(date.setDate(date.getHours() + 1)),
  );

  return [plusOnePercent, minusOnePercent];
}

app.get('/scheduleDailyPredictions', async (req, res) => {
  const { address, pair } = req.body;
  await Moralis.start({ serverUrl, appId, masterKey });
  const predictions = await addPredictionsDaily(address, pair)
  res.send(predictions);
});
