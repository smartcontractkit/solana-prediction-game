import { useState, useEffect } from "react";
import { CURRENCY_PAIRS } from "../lib/constants";
import * as anchor from "@project-serum/anchor";
import * as chainlink from "@chainlink/solana-sdk";
import * as solanaWeb3 from "@solana/web3.js";
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


const useDataFeeds = () => {
    const [dataFeeds, setDataFeeds] = useState([]);

    const secret = Uint8Array.from(process.env.REACT_APP_WALLET_PRIVATE_KEY.split(','));

    const options = anchor.AnchorProvider.defaultOptions();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    const wallet = new Wallet(solanaWeb3.Keypair.fromSecretKey(secret));
    const provider = new anchor.AnchorProvider(connection, wallet, options);
    anchor.setProvider(provider);
    const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");


    const getDataFeeds = () => {
        let promises = CURRENCY_PAIRS.map((pair) => {

            return new Promise(async (res, rej) => {
                const CHAINLINK_FEED_ADDRESS = pair.feedAddress;
                
                const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS);
                //load the data feed account
                let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
                let listener = null;

                //listen for events agains the price feed, and grab the latest rounds price data
                listener = dataFeed.onRound(feedAddress, (event) => {
                    let round = {
                        pair: pair.pair,
                        feed: pair.feedAddress,
                        answer: event.answer,
                        answerToNumber: event.answer.toNumber(),
                        roundId: event.roundId,
                        observationsTS: event.observationsTS,
                        slot: event.slot,
                    };


                    if((round) !== undefined) {
                        provider.connection.removeOnLogsListener(listener);
                        res(round);
                    }

                });
            });
        })

        Promise.all(promises)
        .then(data => {
            setDataFeeds(data);
        })
        .catch(console.error);
    }

    useEffect(() => {
        getDataFeeds();
        window.interval30Sec = setInterval(
            () => getDataFeeds(),
            30000 // every 30 seconds
        )
        return () => {
            clearInterval(window.interval30Sec)
        }
        // eslint-disable-next-line
    }, []);
    console.log(dataFeeds);
    return dataFeeds;
};

export default useDataFeeds;