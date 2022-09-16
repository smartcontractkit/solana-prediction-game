import { Flex, Heading, Image, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../lib/axiosInstance";
import CardSKeleton from "../BetCardSkeleton";
import emptyPredictions from '../../assets/icons/empty-predictions.svg';
import { isExpired } from "../../lib/helpers";
import Predictions from "../Predictions";

const AllPredictions = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const activePredictions = useRef([]);
    const inactivePredictions = useRef([]);

    const toast = useToast();

    useEffect(() => {
        const getPredictions = async () => {
            axiosInstance.get('/api/predictions', {
                params: {
                  active: false
                }
              })
            .then(res => res.data)
            .then(data => {
                const active = data.filter(res => !isExpired(res.predictionDeadline));
                const in_active = data.filter(res => isExpired(res.predictionDeadline));
                activePredictions.current = active;
                inactivePredictions.current = in_active;
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
        // calls getPredictions every 10 minutes
        window.getPredictionsInterval = setInterval(
            () => getPredictions(),
            1000 * 60 * 10 //  1000 ms/s * 60 s/min * 10 min = # ms
        )
        return () => {
            clearInterval(window.getPredictionsInterval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isFetching && (activePredictions.current.length === 0 && inactivePredictions.current.length === 0)) {
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

    if(isFetching) {
        return (
            <Flex
                gap="1.5rem"
                flexWrap="wrap"
                justifyContent={["center", "center", "flex-start", "flex-start"]}
            >
                {[...Array(12)].map((_, i) => <CardSKeleton key={i} />)}
            </Flex>
        )
    }

    return (
        <Flex
            gap="1.5rem"
            w="100%"
            flexDirection="column"
        >
            <Predictions predictions={activePredictions.current} />
              <Heading as="h2" size="md" alignSelf="flex-start">Previous predictions</Heading>
            <Predictions predictions={inactivePredictions.current} />

        </Flex>
    );
}
export default AllPredictions;