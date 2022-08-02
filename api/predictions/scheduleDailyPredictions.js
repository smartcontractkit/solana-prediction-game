
const solanaWeb3 = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
export class Wallet {

    constructor(payer) {
        this.payer = payer
    }

    async signTransaction(tx) {
        tx.partialSign(this.payer);
        return tx;
    }

    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }

    get publicKey() {
        return this.payer.publicKey;
    }
}

const getLatestDataRound = async (req, res) => {

    const { address, pair } = req.query;
    if(!address || !pair) {
        res.status(400).send('Missing address or pair');
        return;
    }
  
    let round = null;
    
    const secret = Uint8Array.from(process.env.REACT_APP_WALLET_PRIVATE_KEY.split(','));
    const options = anchor.AnchorProvider.defaultOptions();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));
    
    const provider = new anchor.AnchorProvider(connection, wallet, options);
    anchor.setProvider(provider);
    
    const CHAINLINK_FEED_ADDRESS = address; 
    const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
    const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);
  
    //load the data feed account
    let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
    let listener = null;
  
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
            res.send(round);
        }
    });
  
}

const createPrediction = async (prediction) => {
    try {
        await connectToDatabase();
        
        const predictionObject = new Prediction(prediction);
        
        const result = await predictionObject.save();
        console.log(`Prediction was inserted with the _id: ${result._id}`);

    } catch (err) {
        console.error("Failed to create new prediction, with error code: " + err.message);
    } 
  
}

module.exports = async (req, res) => {

    if (req.method === 'POST') {
        const { address, pair } = req.body;
        if(!address || !pair) {
            res.status(400).send({
                message: "Address and pair are required"
            });
            return;
        }
    
        const latestRound = await getLatestDataRound(req, res);
    
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
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
  }