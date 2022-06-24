import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

export function useAddressDataFeed() {
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
    const feedAddresses = Object.values(dataFeeds).map(feed => feed.feedAddress); 

    useEffect(() => {

        feeds.map((feed, index) => {
            socket.emit('request_data_feed', feedAddresses[index]);
            socket.on('receive_data_feed', (data_feed) => {
                if(data_feed) {
                    setDataFeeds( previousData =>  { 
                        const newData = previousData
                        newData[feed].roundData = data_feed;
                        return { ...previousData, ...newData } } 
                    );
                }
            });
            return () => {
                socket.off('receive_data_feed');
            }
        })

    }, [feeds, feedAddresses]);

    return dataFeeds;
}