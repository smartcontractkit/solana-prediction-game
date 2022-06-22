const express = require("express");
const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");

const provider = anchor.AnchorProvider.env();

const PORT = process.env.PORT || 3001;

const app = express();


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/solana-feed", (req, res) => {
  getSolanaFeed().then(listener => {
    console.log(listener.toString())
    res.send(listener);
  });
});


async function getSolanaFeed(){
  anchor.setProvider(provider);

  const CHAINLINK_FEED_ADDRESS="HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6"
  const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
  const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS); //SOL-USD Devnet Feed

  //load the data feed account
  let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
  let listener = null;

  //listen for events agains the price feed, and grab the latest rounds price data
  listener = dataFeed.onRound(feedAddress, (event) => {
      console.log(event.answer.toNumber())
  });

  console.log("listener", listener)

  return listener;
}
