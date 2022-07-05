import { useEffect, useState } from 'react';

export function useAddressDataFeed() {

    const [dataFeeds, setDataFeeds] = useState([]);

    const getDataFeeds = () => {

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

        let promises = pairs.map(pair => {
            let queryParams = new URLSearchParams({
                pair: pair.pair,
                address: pair.feedAddress
            });
            return fetch(`${process.env.REACT_APP_SERVER_URL}/getLatestDataRound?` + queryParams , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
                }
            })
            .then(res => res.json());
        })
        Promise.all(promises).then(data => {
            setDataFeeds(data);
        })
        .catch(console.error);
    }

    useEffect(() => {
        getDataFeeds();
    }, []);

    return dataFeeds;
}