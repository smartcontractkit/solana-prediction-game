const solanaWeb3 = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
const Bet = require("../../models/bet.model");
const User = require("../../models/user.model");
const { Wallet } = require("../../models/wallet.model");
const { addMinutes } = require("date-fns");
const { CURRENCY_PAIRS } = require("../../src/lib/constants");

// Create a wallet for the prediction owner
const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));

/**
 * This function retrieves the latest price feed data round from Chainlink Data Feeds.
 * 
 * It creates it connects to solana cluster (devnet | mainnet)
 * Then creates an anchor client provider that uses:
 * 1. A solana connection
 * 2. A wallet to sign transactions and pay for fees
 * 3. Options to confirm transactions
 * 
 * Then retrieves the latest price feed data round from Chainlink Data Feeds.
 * 
 * This function is used in conjuction with github actions to update the schedule hourly predictions using cron.
 * Checkout .github/workflows/predictions-cron.yml for more details
 * This function can be used AWS SQS or Lambda as well
 * 
 * For more info view How to get Data Feeds Off-Chain (Solana) via the link:
 * https://docs.chain.link/docs/solana/using-data-feeds-off-chain/
 * @param address Address of the token pair to retrieve the latest data round from
 * @param pair Pair of the token price feed to retrieve the latest data round from
 */
const getLatestDataRound = async (address, pair) => {

    let round = null;

    //  connection to solana cluster node
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(process.env.REACT_APP_SOLANA_CLUSTER_NETWORK), 'confirmed');

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

/** 
 * 
 * @param date Date object
 * @param minutes number of minutes to add to the date
 * @returns date with added minutes
*/
const addMinutesToDate = (date, minutes) => {
    return addMinutes(date, minutes);//  1000 ms/s * 60 s/min * min = # ms
}


/**
 * This function creates 2 predictions for each pair in the pairs array.
 * One prediction is one percent above the current price and the other is one percent below the current price.
 * The expiry time is set to the next hour.
 * The deadline is set to the 10 minutes before the expiry time.
 *
*/
const schedulePredictions = () => {
    
    const promises = CURRENCY_PAIRS.map(async (pair) => {

        const { feedAddress, pair: currency} = pair;

        const latestRound = await getLatestDataRound(feedAddress, currency);
    
        const { answerToNumber, observationsTS, slot, roundId } = latestRound;
    
        const date = new Date();

        const predictionData = {
            owner: wallet.publicKey,
            account: feedAddress,
            pair: currency,
            expiryTime: addMinutesToDate(date, 120),
            predictionDeadline: addMinutesToDate(date, 60),
            openingPredictionPrice: answerToNumber,
            openingPredictionTime: observationsTS,
            openingPredictionSlot: slot,
            openingPredictionRoundId: roundId,
            ROI: 2,
        };
    
        const plusOnePercent = await createPrediction({
            ...predictionData,
            predictionPrice: answerToNumber * 1.01,
            direction: true,
        });
        const minusOnePercent = await createPrediction({
            ...predictionData,
            predictionPrice: answerToNumber * 0.99,
            direction: false,
        });
    
        return [plusOnePercent, minusOnePercent];
    });

    return Promise.all(promises)
}


/**
 * It updates all bet entities from MongoDB with a 'status' of 'ongoing' via the Mongoose driver. 
 * Checks if the bet expiryTime has passed
 * if so, updates the bet status based on the direction of the prediction and opening prediction price to 'won' or 'lost'.
 * 
 */
const updateBetStatus = async () => {
    const bets = await Bet
        .find({ status: "ongoing" }) // casts a filter based on the query object and returns a list of bets with status 'ongoing'
        .populate("prediction"); // Populate prediction data to each bet


        const promises = bets.map(async (bet) => {
            const { prediction } = bet;
            const { pair, account, direction, openingPredictionPrice, expiryTime } =  prediction;
            
            const { answerToNumber } = await getLatestDataRound(account, pair);
            
            // Check if the bet expiryTime has passed if not the function returns
            if(expiryTime < new Date().toISOString()) {
                return bet;
            }

            let currentStatus = 'ongoing';

            if(direction){
                openingPredictionPrice < answerToNumber
                ? currentStatus = 'won' 
                : currentStatus = 'lost';
            }else{
                openingPredictionPrice > answerToNumber
                ? currentStatus = 'won' 
                : currentStatus = 'lost';
            }

        const result = await Bet
            .findOneAndUpdate({ _id: bet._id }, { status: currentStatus }, { new: true })
            .populate("user");
        console.log(`Bet was inserted with the _id: ${result._id}`);

        const user = result.user;
        const {
            wonTotalBets,
            winRate,
            totalBets,
        } = user;

        let totalWonBets = wonTotalBets; 
        let win_rate = winRate;

        if(currentStatus === 'won') {
            totalWonBets += 1;
        }

        win_rate = (totalWonBets / totalBets) * 100;

        const userUpdated = await User
        .findByIdAndUpdate(
            user._id, 
            { winRate: win_rate, wonTotalBets: totalWonBets }, 
            { new: true }
        );
        console.log(`User was updated with the _id: ${userUpdated._id}`);

        return result;
    })
    
    return Promise.all(promises)
}

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * The request is expected to come in as a POST request to `/api/predictions/schedulePredictions`. 
 * 
 * This function is used in conjuction with github actions to schedule predictions and update the status 
 * of all bets on a hourly basis using cron.
 * Checkout .github/workflows/bet-status-cron.yml for more details
 * This function can be used AWS SQS or Lambda as well
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
            res.status(200).send({
                predictions: await schedulePredictions(),
                betStatus: await updateBetStatus()
            });
        }
        catch(err) {
            res.status(500).send(err);
        }
    
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
  }