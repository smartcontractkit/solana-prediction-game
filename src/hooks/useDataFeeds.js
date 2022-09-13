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

    const getDataFeeds = () => { 
        let queryParams = new URLSearchParams({
            cached: true,
        });

        axiosInstance.get(`/api/feed/getLatestDataRound?${queryParams}`)
        .then(response => {
            setDataFeeds(response.data);
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