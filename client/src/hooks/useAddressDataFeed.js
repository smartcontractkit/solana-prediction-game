import { useEffect, useReducer, useRef, useState } from 'react';
import io from 'socket.io-client';

export function useAddressDataFeed() {
    const socketRef = useRef();
    const [dataFeeds, setDataFeeds] = useState({
        'SOL/USD': {
            feedAddress: process.env.REACT_APP_SOL_USD,
            roundData: null
        },
        // 'BTC/USD': {
        //     feedAddress: process.env.REACT_APP_BTC_USD,
        //     roundData: null
        // },
        // 'ETH/USD': {
        //     feedAddress: process.env.REACT_APP_ETH_USD,
        //     roundData: null
        // },
        // 'LINK/USD': {
        //     feedAddress: process.env.REACT_APP_LINK_USD,
        //     roundData: null
        // },
        // 'USDC/USD': {
        //     feedAddress: process.env.REACT_APP_USDC_USD,
        //     roundData: null
        // },
        // 'USDT/USD': {
        //     feedAddress: process.env.REACT_APP_USDT_USD,
        //     roundData: null
        // }
    });

    const feeds = Object.keys(dataFeeds);

    useEffect(() => {
        socketRef.current = io("http://localhost:3001");
        feeds.forEach(feed => {
            socketRef.current.emit('request_data_feed', {
                feedAddress: dataFeeds[feed].feedAddress,
                pair: feed
            });
        });
        // eslint-disable-next-line
    }, []);

    const useForceRender = () => {
        const [, forceRender] = useReducer(x => !x, true)
        return forceRender
    }

    const forceRender = useForceRender()

    useEffect(() => {
        socketRef.current.on('receive_data_feed', (data_feed) => {
            if(data_feed) {
                setDataFeeds(previousData => {
                    let newDataFeeds = previousData;
                    newDataFeeds[data_feed.pair].roundData = data_feed;
                    return newDataFeeds;
                });
                forceRender();
                console.log(`Updated feed: ${dataFeeds[data_feed.pair]}`); // TODO find fix for forcing re-render
            }
        });
    }, [dataFeeds, forceRender]);
    return dataFeeds;
}