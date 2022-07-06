const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataFeed = require("./dataFeed");
const predictions = require("./predictions");
const transactions = require("./transactions");

const PORT = process.env.PORT || 3001;

const Moralis = require("moralis/node");
const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;

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
    dataFeed.getChainlinkFeed(io, feed);
  });
});

server.listen(PORT, async() => {
  console.log(`Server listening on ${PORT}`);
  await Moralis.start({ serverUrl, appId, masterKey });
});

app.get('/getLatestDataRound', async (req, res) => {
  const { address, pair } = req.query;
  let latestRound = await dataFeed.getLatestDataRound(address, pair);
  res.send(latestRound);
});

app.post('/addPrediction', async (req, res) => {
  const prediction  = req.body;
  
  const predictionData = await predictions.createPrediction({
    ...prediction,
    expiryTime: new Date(prediction.expiryTime),
    predictionDeadline: new Date(prediction.predictionDeadline),
    openingPredictionTime: new Date(prediction.openingPredictionTime),
  });

  res.send(predictionData);
});

app.get('/scheduleDailyPredictions', async (req, res) => {
  const { address, pair } = req.body;
  const predictions = await predictions.addPredictionsDaily(address, pair)
  res.send(predictions);
});

app.post('/escrowTransferSOL', async (req, res) => {
  const { toAddress, amount } = req.body;
  const solTransfer = await transactions.escrowTransferSOL(toAddress, amount)
  res.send(solTransfer);
});
