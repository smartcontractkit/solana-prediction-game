import { Flex, Image, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import useDataFeeds from "../../hooks/useDataFeeds";
import BetCard from "../BetCard";
import CardSKeleton from "../BetCardSkeleton";
import emptyPredictions from '../../assets/icons/empty-predictions.svg';

const ActivePredictions = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ predictions, setPredictions ] = useState([]);

    const dataFeeds = useDataFeeds();

    const toast = useToast();

    useEffect(() => {
        const getPredictions = async () => {
            axiosInstance.get('/api/predictions/active')
            .then(res => res.data)
            .then(data => {
                setPredictions(data);
                setIsFetching(false);
            })
            .catch(err => {
                setIsFetching(false);
                toast({
                    title: 'Error getting predictions.',
                    description: err.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            });  
        }

        getPredictions();
        window.getPredictionsInterval = setInterval(
            () => getPredictions(),
            120000
        )
        return () => {
            clearInterval(window.getPredictionsInterval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!isFetching && predictions.length === 0) {
        return (
            <VStack 
                w="100%"
                py={14}
                borderY="1px solid"
                borderColor="whiteAlpha.300"
            >
                <Image src={emptyPredictions} height="64px" alt="no active predictions" my="10px" />
                <Text size="md" color="gray.200" fontWeight="700" textAlign="center">
                    Generating Predictions
                </Text>
                <Text size="md" color="gray.200" fontWeight="400" textAlign="center">
                    Please, wait a few minutes to get a list of new predictions. 
                </Text>
            </VStack>
        )
    }
    
    return (
        <Flex
            gap="1.5rem"
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