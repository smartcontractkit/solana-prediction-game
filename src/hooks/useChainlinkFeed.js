import { useEffect, useState } from "react";

import anchor from "@project-serum/anchor";
import chainlink from "@chainlink/solana-sdk";

const provider = anchor.AnchorProvider.env();

const useChainlinkFeed = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		getFeed();
	}, []);

	async function getFeed(){

		anchor.setProvider(provider);

		const CHAINLINK_FEED_ADDRESS="HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6"
		const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
		const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS); //SOL-USD Devnet Feed
	
		//load the data feed account
		let dataFeed = await chainlink.OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
		
		//listen for events agains the price feed, and grab the latest rounds price data
		dataFeed.onRound(feedAddress, (event) => {
			console.log(event.answer.toNumber())
			setData(event.answer.toNumber())
		});
	
		//block execution and keep waiting for events to be emitted with price data
		await new Promise(function () {});
		
	}
	return data;
};

export default useChainlinkFeed;
