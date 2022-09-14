import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosInstance";
/**
 * 
 * @returns price feeds from getLatestDataRound api every 60 seconds
 */
const useDataFeeds = () => {
    const [dataFeeds, setDataFeeds] = useState([]);

    const toast = useToast();

    const handleDataFeedUpdate = (round) => {
        setDataFeeds(oldDataFeeds => {
            let foundIndex = oldDataFeeds.findIndex(df => (df.feed === round.feed));
            if(foundIndex === -1) {
                oldDataFeeds.push(round);
                return oldDataFeeds;
            }else {
                oldDataFeeds[foundIndex] = round;
                return oldDataFeeds;
            }
        });
    }

    const getDataFeeds = (cached) => { 
        let queryParams = new URLSearchParams({
            cached
        });

        axiosInstance.get(`/api/feed/getLatestDataRound?${queryParams}`)
        .then(response => {
            response.data.map(feed => {
                if(!('status' in feed)){
                    handleDataFeedUpdate(feed);
                }else{
                    if(feed.status === 'fulfilled'){
                        handleDataFeedUpdate(feed.value);
                    }
                }
                return feed;
            });
        })
        .catch(err => {
            toast({
                title: 'Error getting Price Feeds. Retrying...',
                description: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        });
    }

    useEffect(() => {
        getDataFeeds(true);
        window.dataFeedInterval = setInterval(
            () => getDataFeeds(false),
            60000 // every 60 seconds
        )
        return () => {
            clearInterval(window.dataFeedInterval)
        }
        // eslint-disable-next-line
    }, []);
    return dataFeeds;
};

export default useDataFeeds;