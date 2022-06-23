import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

export function useAddressDataFeed() {

    const [dataFeeds, setDataFeeds] = useState({
        'BTC/USD': {
            feedAddress: "CzZQBrJCLqjXRfMjRN3fhbxur2QYHUzkpaRwkWsiPqbz",
            roundData: null
        },
        'ETH/USD': {
            feedAddress: "2ypeVyYnZaW2TNYXXTaZq9YhYvnqcjCiifW1C6n8b7Go",
            roundData: null
        },
        'LINK/USD': {
            feedAddress: "6N2eCQv8hBkyZjSzN1pe5QtznZL9bGn6TZzcFhaYSLTs",
            roundData: null
        },
        'SOL/USD': {
            feedAddress: "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6",
            roundData: null
        },
        'USDC/USD': {
            feedAddress: "4NmRgDfAZrfBHQBuzstMP5Bu1pgBzVn8u1djSvNrNkrN",
            roundData: null
        },
        'USDT/USD': {
            feedAddress: "EkTcZ3StgQkahMtDBuREiaowjNUyeGnEDHnMbWgMGUJQ",
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