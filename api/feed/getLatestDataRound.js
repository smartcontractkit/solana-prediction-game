const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const solanaWeb3 = require("@solana/web3.js");
const { Wallet } = require("../../models/wallet.model");

const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));


const getLatestDataRound = async (address, pair) => {
  
    let round = null;
    
    const options = anchor.AnchorProvider.defaultOptions();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    
    const provider = new anchor.AnchorProvider(connection, wallet, options);
    anchor.setProvider(provider);
    
    const CHAINLINK_FEED_ADDRESS = address; 
    const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
    const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);
  
    //load the data feed account
    let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
    let listener = null;

    return new Promise(async (res, rej) => {
        //listen for events agains the price feed, and grab the latest rounds price data
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
            if((round) !== undefined) {
                console.log(`Received event ${address}: ${round.answerToNumber}`);
                provider.connection.removeOnLogsListener(listener);
                res(round);
            }
        });
    });
  
}

module.exports = async (req, res) => {

    const { address, pair } = req.query;
    if(!address || !pair) {
        res.status(400).send('Missing address or pair');
        return;
    }

    console.log(address, pair);

    try {
        const round = await getLatestDataRound(address, pair);
        res.status(200).send(round);
    }

    catch(err) {
        res.status(500).send(err);
    }
} 