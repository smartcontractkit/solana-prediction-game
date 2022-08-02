const { connectToDatabase } = require("../../lib/mongoose");
const solanaWeb3 = require("@solana/web3.js");
const { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

module.exports = async (req, res) => {
    await connectToDatabase();

    const { toAddress, amount } = req.body;
    if(!toAddress || !amount) {
        res.status(400).send('Missing toAddress or amount');
        return;
    }

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const toPubkey = new PublicKey(toAddress);

    const secret = Uint8Array.from(process.env.REACT_APP_WALLET_PRIVATE_KEY.split(','));
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
    .then(response => {
        console.log("response", response);
        return {
        transactionId: response
        };
    })
    .catch(error => {
        console.error("error", error);  
    })
}