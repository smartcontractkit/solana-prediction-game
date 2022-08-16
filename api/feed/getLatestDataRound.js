const anchor = require("@project-serum/anchor");
const chainlink = require("@chainlink/solana-sdk");
const solanaWeb3 = require("@solana/web3.js");
const { Wallet } = require("../../models/wallet.model");

// creation of wallett using your private key
const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request query payload, it retrieves the latest price feed data round from MongoDB based on queries from the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/feed/getLatestDataRound`. 
 * The request body should have the shape: 
 * { address: "0x...", pair: "XXX-USD" }
 * For more info view How to get Data Feeds Off-Chain (Solana) via the link:
 * https://docs.chain.link/docs/solana/using-data-feeds-off-chain/
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
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

module.exports = async (req, res) => {

    const { address, pair } = req.query;
    if(!address || !pair) {
        res.status(400).send('Missing address or pair');
        return;
    }

    try {
        const round = await getLatestDataRound(address, pair);
        res.status(200).send(round);
    }

    catch(err) {
        res.status(500).send(err);
    }
} 