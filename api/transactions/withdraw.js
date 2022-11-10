const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const solanaWeb3 = require("@solana/web3.js");
const { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

const checkBalanceAndFund = async (connection, publicKey) => {
    try {
        const rawBalance = await connection.getBalance(publicKey);
        const formattedBalance = rawBalance/LAMPORTS_PER_SOL;
        console.log('current balance is:', formattedBalance);
    
        if(formattedBalance < 10) {
            console.log('Requesting airdrop');
            await connection.requestAirdrop(publicKey, 2*LAMPORTS_PER_SOL);
        }
    } catch (error) {
        // we do not break on purpose as sometimes the airdrop may fail, but we do not want to fail the full withdraw
        console.log('airdrop failed', error);
    }
}

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * Given the expected request payload, it sends users their winnings via their public address.
 * The request is expected to come in as a POST request to `/api/transactions/withdraw`. 
 * The request body should have the shape: 
 * { withdrawAddress: "0x...", amount: "0x...", _id: "0x..." }
 * 
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {
    if (req.method === ('POST')) {
        try {
            await connectToDatabase();

            const { withdrawAddress, amount, _id } = req.body;

            if (!withdrawAddress || !amount || !_id) {
                res.status(400).send('Missing withdrawAddress or amount or _id');
                return;
            }
            
            // connect to solana cluster
            const connection = new Connection(clusterApiUrl(process.env.REACT_APP_SOLANA_CLUSTER_NETWORK), "confirmed");

            // get public key of bet owner address
            const toPubkey = new PublicKey(withdrawAddress);

            // get escrow account key pair from private key
            const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
            const escrowKeyPair = Keypair.fromSecretKey(secret);

            //Check if the escow account as enough SOL to pay the bet otherwise fund it
            await checkBalanceAndFund(connection, escrowKeyPair.publicKey);

            // create transaction to transfer funds from escrow account to bet owner address
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: escrowKeyPair.publicKey,
                    toPubkey,
                    lamports: LAMPORTS_PER_SOL * amount,
                })
            );

            // sign transaction with escrow account key pair
            return sendAndConfirmTransaction(
                connection,
                transaction,
                [escrowKeyPair]
            )
            .then(async (response) => {

                // update bet status to 'completed'
                const result = await Bet.findOneAndUpdate({ _id }, { status: 'completed' }, {
                    new: true
                });
                console.log(`Bet was updated with the _id: ${result._id}`);
                
                // return transaction id for confirmation on https://explorer.solana.com/tx/[transactionId]
                res.status(200).send({
                    transactionId: response
                })
            })
            .catch(error => {
                console.error("error", error);  
                res.status(500).send(error);
            })
        } catch (err) {
            console.error("Failed to update bet, with error code: " + err.message);

            res.status(500).send(err);
        } 
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
    
}