import React, { useState, useEffect } from "react";
import { createContext } from "react"; 
import axiosInstance from "../../helpers/axiosInstance";
import { CURRENCY_PAIRS } from "../../lib/constants";

const FeedProvider = (props) => {
    const [dataFeeds, setDataFeeds] = useState([]);

    const getDataFeeds = () => {
        let promises = CURRENCY_PAIRS.map(pair => {
            let queryParams = new URLSearchParams({
                pair: pair.pair,
                address: pair.feedAddress
            });
            return axiosInstance.get(`/feed/getLatestDataRound?${queryParams}`)
            .then(res => res.data);
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
        
    }, []);

    return(
        <FeedContext.Provider value={ dataFeeds }>
            { props.children }
        </FeedContext.Provider>
    )
};

export const FeedContext = createContext({  
    dataFeeds: []
}); 

export default FeedProvider;