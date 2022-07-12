import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import {  } from "@chakra-ui/react";
import { useMoralisCloudFunction } from "react-moralis";
import BetCard from "../BetCard";

const ActivePredictions = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ predictions, setPredictions ] = useState([]);

    const { fetch } = useMoralisCloudFunction(
        "getPredictions",
        { status: true },
        { autoFetch: false }
    );

    useEffect(() => {
        fetch({
            onSuccess: (result) => {
                setPredictions(result);
                setIsFetching(false);
            },
            onError: (error) => {
                console.log(error);
                setIsFetching(false);
            }
        });
    }, []);

    if(isFetching) {
        return <div>Loading...</div>
    }
    
    return (
        <Flex
            padding={8}
            gap={8}
            flexWrap="wrap"
        >
            {
                predictions.map(prediction => {
                    const { id, attributes, createdAt, updatedAt } = prediction;
                    return <BetCard 
                        key={id} 
                        attributes={attributes}
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        />
                })
            }
        </Flex>
    )
}
export default ActivePredictions;