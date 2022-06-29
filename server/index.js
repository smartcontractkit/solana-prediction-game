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
    // io.in(feed.feedAddress).emit('receive_data_feed', {
    //   pair: feed.pair,
    //   feed: feed.feedAddress,
    //   answerToNumber: 123456,
    //   observationsTS: "2020-01-01T00:00:00.000Z",
    //   roundId: 1,
    //   slot: 1,
    // }); 
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
  listener = await dataFeed.onRound(feedAddress, async (event) => {
    round = {
      pair: pair,
      answerToNumber: event.answer.toNumber(),
      ...event,
    };
  });

  if((round ?? undefined) !== undefined) {
    console.log(round);
    console.log(listener);
    console.log(`Received event ${address}: ${round.answerToNumber}`);
    provider.connection.removeOnLogsListener(listener);
    return round;
  }
}

app.get('/getLatestDataRound', async (req, res) => {
  const { address, pair } = req.body;
  let latestRound = await getLatestDataRound(address, pair);
  res.send(latestRound);
});

const cron = require('node-cron');

const Moralis = require("moralis/node");

/* Moralis init code */
const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;

createPrediction = async ({ pair, answerToNumber, feed, observationsTS}, predictionData) => {

  const Prediction = Moralis.Object.extend("Prediction");
  const prediction = new Prediction();

  var date = new Date();

  await prediction.save({
    owner: "6hvdYCWxFH3bQHKAjXeheUee1HJbp382kQzySwd8LpRk",
    account: feed,
    pair,
    prediction: predictionData,
    expiryTime: new Date(date.setDate(date.getDate() + 1)),
    predictionDeadline: new Date(date.setDate(date.getDate() + 1)),
    openingPredictionPrice: answerToNumber,
    openingPredictionTime: observationsTS,
    status: true,
  });
}

addPredictionsDaily = async (address, pair) => {
  let latestRound = await getLatestDataRound(address, pair, res);
  console.log(latestRound, address, pair);
  await createPrediction(latestRound, latestRound.answerToNumber * 1.01);
  await createPrediction(latestRound, latestRound.answerToNumber * 0.99);
  
  cron.schedule('0 0 * * *', async function() {
    await createPrediction(latestRound, latestRound.answerToNumber * 1.01);
    await createPrediction(latestRound, latestRound.answerToNumber * 0.99);
  });
}

app.get('/scheduleDailyPrediction', async (req, res) => {
  const { address, pair } = req.body;
  await Moralis.start({ serverUrl, appId, masterKey });
  await addPredictionsDaily(address, pair);
});
