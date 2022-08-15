const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
const getLatestDataRound = require("../feed/getLatestDataRound");
const solanaWeb3 = require("@solana/web3.js");

// Create a wallet for the prediction owner
const { Wallet } = require("../../models/wallet.model");
const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));

/**
 * 
 * @param {*} prediction 
 * @returns prediction created with prediction id
 */
const createPrediction = async (prediction) => {
    try {
        await connectToDatabase();
        
        const predictionObject = new Prediction(prediction);
        
        const result = await predictionObject.save();
        console.log(`Prediction was inserted with the _id: ${result._id}`);

        return result;

    } catch (err) {
        console.error("Failed to create new prediction, with error code: " + err.message);
    } 
  
}

// token pairs on chainlink solana data feeds
const pairs = [
    {
        pair: 'SOL/USD',
        feedAddress: process.env.REACT_APP_SOL_USD
    },
    {
        pair: 'BTC/USD',
        feedAddress: process.env.REACT_APP_BTC_USD
    },
    {
        pair: 'ETH/USD',
        feedAddress: process.env.REACT_APP_ETH_USD
    },
    {
        pair: 'LINK/USD',
        feedAddress: process.env.REACT_APP_LINK_USD
    },
    {
        pair: 'USDC/USD',
        feedAddress: process.env.REACT_APP_USDC_USD
    },
    {
        pair: 'USDT/USD',
        feedAddress: process.env.REACT_APP_USDT_USD
    }
];

/** 
 * 
 * @param {date, minutes}
 * @returns date with added minutes
*/
const addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
}

/**
 * Creates a 2 prediction for each pair in the pairs array
 * One prediction is one percent above the current price and the other is one percent below the current price
 * The expiry time is set to the next hour
 * The deadline is set to the 10 minutes before the expiry time
*/
module.exports = async (req, res) => {

    if (req.method === 'POST') {
        const { authorization } = req.headers;

        if (authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
            res.status(401).send('Unauthorized');
            return;
        }

        try{

            let promises = pairs.map(async (pair) => {

                const latestRound = await getLatestDataRound(pair.feedAddress, pair.pair);
            
                const { answerToNumber, observationsTS, slot, roundId } = latestRound;
            
                var date = new Date();

                const predictionData = {
                    owner: wallet.publicKey,
                    account: pair.feedAddress,
                    pair: pair.pair,
                    expiryTime: addMinutesToDate(date, 60),
                    predictionDeadline: addMinutesToDate(date, 50),
                    openingPredictionPrice: answerToNumber,
                    openingPredictionTime: observationsTS,
                    openingPredictionSlot: slot,
                    openingPredictionRoundId: roundId,
                    ROI: 2,
                };
            
                const plusOnePercent = await createPrediction({
                    ...predictionData,
                    predictionPrice: latestRound.answerToNumber * 1.01,
                    direction: true,
                });
                const minusOnePercent = await createPrediction({
                    ...predictionData,
                    predictionPrice: latestRound.answerToNumber * 0.99,
                    direction: false,
                });
            
                return [plusOnePercent, minusOnePercent];
            });
            Promise.all(promises).then((predictions) => {
                res.status(200).send(predictions.flat(Infinity));
            });
        }
        catch(err) {
            console.error("Failed to create new predictions, with error code: " + err.message);
            res.status(500).send(err);
        }
    
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
  }