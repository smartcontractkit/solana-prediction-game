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

    const secret = Uint8Array.from([85,105,9,5,143,6,151,16,145,226,251,129,35,195,180,119,115,128,163,138,123,125,47,105,176,149,182,84,203,162,169,223,97,231,10,129,35,97,6,149,220,235,224,147,178,234,48,238,172,81,76,170,95,237,199,20,64,30,116,47,24,97,77,72])
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