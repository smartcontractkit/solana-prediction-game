import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import useDataFeeds from "../../hooks/useDataFeeds";
import BetCard from "../BetCard";
import CardSKeleton from "../BetCardSkeleton";

const ActivePredictions = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ predictions, setPredictions ] = useState([]);

    const dataFeeds = useDataFeeds();


    useEffect(() => {
        axiosInstance.get('/api/predictions')
        .then(res => res.data)
        .then(data => {
            setPredictions(data);
            setIsFetching(false);
        })
        .catch(err => {
            setIsFetching(false);
            console.log("Error occured: " + err.message);
        });  
    }, []);
    
    return (
        <Flex
            gap={2}
            flexWrap="wrap"
            justifyContent={["center", "center", "flex-start", "flex-start"]}
        >
            {
                isFetching 
                ? [...Array(12)].map((_, i) => <CardSKeleton key={i} />)
                : predictions.map(prediction => {
                    const { _id, pair } = prediction;
                    const feed = dataFeeds.find(data => data.pair === pair);
                    return (
                        <BetCard 
                            key={_id}
                            prediction={prediction}
                            feed={feed}
                        />
                    );
                })
            }
        </Flex>
    );
}
export default ActivePredictions;