const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
const solanaWeb3 = require("@solana/web3.js");
const { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

module.exports = async (req, res) => {
    if (req.method === ('POST')) {
        try {
            await connectToDatabase();

            const { withdrawAddress, amount, _id } = req.body;

            if (!withdrawAddress || !amount || !_id) {
                res.status(400).send('Missing withdrawAddress or amount or _id');
                return;
            }

            const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
            const toPubkey = new PublicKey(withdrawAddress);

            const secret = Uint8Array.from(process.env.WALLET_PRIVATE_KEY.split(','));
            const escrowKeyPair = Keypair.fromSecretKey(secret);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: escrowKeyPair.publicKey,
                    toPubkey,
                    lamports: LAMPORTS_PER_SOL * amount,
                })
            );

            return sendAndConfirmTransaction(
                connection,
                transaction,
                [escrowKeyPair]
            )
            .then(async (response) => {
                console.log("response", response);

                const result = await Bet.findOneAndUpdate({ _id }, { status: 'completed' }, {
                    new: true
                });
                console.log(`Bet was inserted with the _id: ${result._id}`);
        
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