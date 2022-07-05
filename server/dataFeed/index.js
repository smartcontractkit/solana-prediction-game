const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const provider = anchor.AnchorProvider.env();

const getChainlinkFeed = async (io, feed) => {
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

const getLatestDataRound = async (address, pair) => {
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

module.exports = {
  getChainlinkFeed,
  getLatestDataRound
}