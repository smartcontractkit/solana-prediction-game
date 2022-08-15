// user wallet class to allow for creation of a custom anchor provider
export class Wallet {

    constructor(payer) {
        this.payer = payer
    }

    async signTransaction(tx) {
        tx.partialSign(this.payer);
        return tx;
    }

    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }

    get publicKey() {
        return this.payer.publicKey;
    }
}