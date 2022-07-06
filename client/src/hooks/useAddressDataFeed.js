import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export function useAddressDataFeed() {

    const [dataFeeds, setDataFeeds] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef();

    const pairs = [
        {
            pair: 'SOL/USD',
            feedAddress: process.env.REACT_APP_SOL_USD
        },
        {
            pair: 'BTC/USD',
            feedAddress: process.env.REACT_APP_BTC_USD
        },
        {
            pair: 'ETH/USD',
            feedAddress: process.env.REACT_APP_ETH_USD
        },
        {
            pair: 'LINK/USD',
            feedAddress: process.env.REACT_APP_LINK_USD
        },
        {
            pair: 'USDC/USD',
            feedAddress: process.env.REACT_APP_USDC_USD
        },
        {
            pair: 'USDT/USD',
            feedAddress: process.env.REACT_APP_USDT_USD
        }
    ];

    useEffect(() => {
        
        socketRef.current = io("http://localhost:3001");
        pairs.forEach(pair => {
            socketRef.current.emit('request_data_feed', {
                feedAddress: pair.feedAddress,
                pair: pair.pair
            });
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        socketRef.current.on('receive_data_feed', (data_feed) => {
            if(data_feed) {
                setDataFeeds(previousData => {
                    const objIndex = previousData.findIndex((obj => obj.pair ===  data_feed.pair));

                    if(objIndex === -1) {
                        return [...previousData, data_feed];
                    }
                    previousData.splice(objIndex, 1, data_feed);
                    return previousData;
                });
                setRefresh(!refresh);
            }
        });
    }, [refresh]);
    
    useEffect(() => {
        if(dataFeeds.length === pairs.length) {
            setIsLoading(false);
        }
        // eslint-disable-next-line 
    },[dataFeeds]);

    return {
        dataFeeds,
        isLoading
    };
}