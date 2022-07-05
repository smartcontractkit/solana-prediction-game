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

const solanaWeb3 = require("@solana/web3.js");
const { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

escrowTransferSOL = async (toAddress, amount) => {

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const toPubkey = new PublicKey(toAddress);

  const secret = Uint8Array.from([85,105,9,5,143,6,151,16,145,226,251,129,35,195,180,119,115,128,163,138,123,125,47,105,176,149,182,84,203,162,169,223,97,231,10,129,35,97,6,149,220,235,224,147,178,234,48,238,172,81,76,170,95,237,199,20,64,30,116,47,24,97,77,72])
  const escrowKeyPair = Keypair.fromSecretKey(secret);

  const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: escrowKeyPair.publicKey,
        toPubkey,
        lamports: LAMPORTS_PER_SOL * amount,
      })
  );

  return sendAndConfirmTransaction(
      connection,
      transaction,
      [escrowKeyPair]
  )
  .then(response => {
    console.log("response", response);
    return {
      transactionId: response
    };
  })
  .catch(error => {
    console.error("error", error);  
  })
}

app.post('/escrowTransferSOL', async (req, res) => {
  const { toAddress, amount } = req.body;
  const solTransfer = await escrowTransferSOL(toAddress, amount)
  res.send(solTransfer);
});
