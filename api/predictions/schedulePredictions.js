const solanaWeb3 = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
const { Wallet } = require("../../models/wallet.model");

// Create a wallet for the prediction owner
const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));


// Using Data Feeds Off-Chain (Solana) to get the latest data round
// https://docs.chain.link/docs/solana/using-data-feeds-off-chain/
const getLatestDataRound = async (address, pair) => {

    let round = null;

    //  connection to solana cluster node
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    // creation of a new anchor client provider without use of node server & id.json
    const options = anchor.AnchorProvider.defaultOptions();
    const provider = new anchor.AnchorProvider(connection, wallet, options);
    anchor.setProvider(provider);

    const CHAINLINK_FEED_ADDRESS = address; 
    const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);

    // load the data feed account using the predefined chainlink program ID
    const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
    let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
    let listener = null;

    return new Promise(async (res, rej) => {
        // listen for events from the price feed, and grab the latest rounds' price data
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
            // return the latest round only if event data is available
            if((round) !== undefined) {
                provider.connection.removeOnLogsListener(listener);
                res(round);
            }
        });
    });

}

/**
 * Given the expected prediction entity, this function generates a new prediction entity and stores it in MongoDB.
 *
 * @param prediction Prediction entity (see api/models/prediction.model.js).
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
 * @param date Date object
 * @param minutes number of minutes to add to the date
 * @returns date with added minutes
*/
const addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes * 1000 * 60); //  1000 ms/s * 60 s/min * min = # ms
}

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * The request is expected to come in as a POST request to `/api/predictions/add`. 
 * Creates 2 predictions for each pair in the pairs array.
 * One prediction is one percent above the current price and the other is one percent below the current price.
 * The expiry time is set to the next hour.
 * The deadline is set to the 10 minutes before the expiry time.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
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