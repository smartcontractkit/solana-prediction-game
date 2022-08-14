import { useState, useEffect } from "react";
import { CURRENCY_PAIRS } from "../lib/constants";
import axiosInstance from "../helpers/axiosInstance";


const useDataFeeds = () => {
    const [dataFeeds, setDataFeeds] = useState([]);


    const getDataFeeds = () => {
        let promises = CURRENCY_PAIRS.map((pair) => {

            let queryParams = new URLSearchParams({
                pair: pair.pair,
                address: pair.feedAddress
            });

            return new Promise(async (res, rej) => {
                return axiosInstance.get(`/api/feed/getLatestDataRound?${queryParams}`)
                .then(res => res.data);
            });
        })

        Promise.all(promises)
        .then(data => {
            console.log(data);
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
    return dataFeeds;
};

export default useDataFeeds;