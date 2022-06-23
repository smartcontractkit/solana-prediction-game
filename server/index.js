const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 3001;

const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const provider = anchor.AnchorProvider.env();

async function getSolanaFeed(socket, address){
  anchor.setProvider(provider);

  // const CHAINLINK_FEED_ADDRESS = address; // getting base64 error
  const CHAINLINK_FEED_ADDRESS = "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6"; // TODO change to address
  const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
  const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);

  //load the data feed account
  let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
  let listener = null;

  //listen for events agains the price feed, and grab the latest rounds price data
  listener = dataFeed.onRound(feedAddress, (event) => {
    const eventData = {
      feed: event.feed,
      answer: event.answer,
      answerToNumber: event.answer.toNumber(),
      roundId: event.roundId,
      observationsTS: event.observationsTS,
      slot: event.slot,
    };
    // socket.to(feedAddress).emit('receive_solana_data_feed', eventData); // TODO change to address
    socket.broadcast.emit('receive_solana_data_feed', eventData);
  });
}

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  }
});

io.on('connection', (socket) => {
  socket.on('get_solana_data_feed', (feedAddress) => {
    console.log(`feedAddress: ${feedAddress}`);
    console.log(`New User: ${socket.client.id}`);
    // socket.join(feedAddress); // TODO change to address
    getSolanaFeed(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
