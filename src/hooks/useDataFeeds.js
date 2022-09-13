import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosInstance";
/**
 * 
 * @returns price feeds from getLatestDataRound api every 30 seconds
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
        })
    }

    const getDataFeeds = (cached) => { 
        let queryParams = new URLSearchParams({
            cached
        });

        axiosInstance.get(`/api/feed/getLatestDataRound?${queryParams}`)
        .then(response => {
            response.data.map(res => {
                if(cached){
                    handleDataFeedUpdate(res)
                }else{
                    if(res.status === 'fulfilled'){
                        handleDataFeedUpdate(res.value);
                    }
                }
                return res;
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
        getDataFeeds(false);
        window.dataFeedInterval = setInterval(
            () => getDataFeeds(true),
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