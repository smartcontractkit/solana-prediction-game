import { useState, useEffect } from "react";
import axiosInstance from "../helpers/axiosInstance";
import { CURRENCY_PAIRS } from "../lib/constants";

const useDataFeeds = () => {
    const [dataFeeds, setDataFeeds] = useState([]);

    const getDataFeeds = () => {
        let promises = CURRENCY_PAIRS.map(pair => {
            let queryParams = new URLSearchParams({
                pair: pair.pair,
                address: pair.feedAddress
            });
            return axiosInstance.get(`/api/feed/getLatestDataRound?${queryParams}`)
            .then(res => res.data);
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
        
    }, []);

    return dataFeeds;
};

export default useDataFeeds;