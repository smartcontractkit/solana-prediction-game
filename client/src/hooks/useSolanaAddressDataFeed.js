import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

export function useSolanaAddressDataFeed() {

    const [dataFeeds, setDataFeeds] = useState({
        'SOL/USD': {
            feedAddress: "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6",
            roundData: null
        }
    });

    useEffect(() => {

        const feeds = Object.keys(dataFeeds);

        feeds.map(feed => {
            socket.emit('get_solana_data_feed', dataFeeds[feed].feedAddress);
            socket.on('receive_solana_data_feed', (solanaDataFeedAddress) => {
                if(solanaDataFeedAddress) {
                    let newData = dataFeeds;
                    newData[feed].roundData = solanaDataFeedAddress;
                    setDataFeeds(newData);
                }
            });
            return feed
        })

    }, [dataFeeds]);

    return dataFeeds;
}