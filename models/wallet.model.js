/** 
* This is a simple wallet interface that allows for signing of basic transactions on the solana network,
* and paying for fees.
* It takes in a Keypair as its input during instantiation that is used to sign transactions and pay for fees.
* The primary function of a Keypair is to enable verification of the signature. 
* Verification of a signature allows the recipient to be sure that the data was signed by the owner of a specific private key.
* More info on Keypairs: https://solanacookbook.com/references/keypairs-and-wallets.html
*
* @constructor keypair Keypair to sign transactions and pay for fees.
*/
export class Wallet {

    constructor(payer) {
        this.payer = payer
    }

    // Asynchronous function that allows for signing a single transaction 
    async signTransaction(tx) {
        tx.partialSign(this.payer);
        return tx;
    }

    // Asynchronous function that allows for signing a multiple transactions
    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }

    // This returns the public key of the wallet
    get publicKey() {
        return this.payer.publicKey;
    }
}