const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
const solanaWeb3 = require("@solana/web3.js");
const { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

/**
 * 
 * Vercel cloud function triggered by user withdrawing their winnings.
 * 
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
            const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

            // get public key of bet owner address
            const toPubkey = new PublicKey(withdrawAddress);

            // get escrow account key pair from private key
            const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
            const escrowKeyPair = Keypair.fromSecretKey(secret);

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
                console.log(`Bet was inserted with the _id: ${result._id}`);
                
                // return transaction id for confirmation on https://explorer.solana.com/tx/[transactionId]
                return {
                    transactionId: response
                };
            })
            .catch(error => {
                console.error("error", error);  
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