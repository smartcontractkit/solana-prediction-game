import { Wrap, Flex, HStack, Text, VStack, WrapItem, Center, Box } from "@chakra-ui/react";
import { getCurrenciesFromPairs } from "../../helpers/sol_helpers";
import { DIVISOR } from "../../lib/constants";
import { roundOff } from "../../helpers/sol_helpers";
import { useContext } from "react";
import { SocketContext } from "../../providers/SocketProvider";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

const BetCard = ({ id, attributes, createdAt, updatedAt }) => {
    const { account, pair, prediction, predictionDeadline, expiryTime } = attributes;
    const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);
    // console.log(attributes);

    const { dataFeeds } = useContext(SocketContext);
    const feed = dataFeeds.find(data => data.pair === pair);

    const predictionPrice = roundOff((prediction / DIVISOR), 2);
    
    if(!feed) {
        return null;
    }

    let isIncrease = feed.price > predictionPrice;

    return (
        <Flex
            borderRadius="20px"
            bg="gray.800"
            p="16px"
            h="256px"
            w="300px"
            gap="32px"
            alignItems="flex-start"
            direction="column"    
        >
            <HStack
                padding={["0px", "36px", "0px", "0px"]}
                gap="4px"
                isolation="isolate"
                alignSelf="stretch"
                justify="space-between"
            >
                <VStack
                    alignItems="flex-start"
                >   
                    <HStack spacing={1}>
                        <Text fontWeight={700} fontSize="md" >
                            {firstCurrency}
                        </Text>
                        <Text fontSize="md">
                            will settle
                        </Text>
                        <Text fontSize="md" color={ isIncrease ? 'green.200' : 'pink.200' } >
                            { isIncrease ? 'above' : 'below' } 
                        </Text>
                    </HStack>
                    <Text as="span" mt="0px!important" fontWeight={700} fontSize="md" >
                        {predictionPrice}  {secondCurrency}
                    </Text>
                    <Text fontWeight={500} fontSize="xs" color="gray.500">
                        at {new Date(expiryTime).toLocaleString()}
                    </Text>
                </VStack>
                <Flex
                    alignSelf="flex-start" 
                    width="24px"
                    height="24px"
                    borderRadius="6px"
                    bg={ isIncrease ? 'green.900' : 'pink.900' } 
                    justify="center"
                    alignItems="center"
                >   
                    {
                        isIncrease 
                        ? <ArrowUpIcon 
                                width="16px"
                                height="16px"
                                color="green.200"
                            />
                        : <ArrowDownIcon 
                                width="16px"
                                height="16px"
                                color="pink.200"
                            />
                    }
                </Flex>
            </HStack>

        </Flex>
        // <VStack>
        //     <Text>
        //         {`${firstCurrency} will settle above ${price}${secondCurrency}`}
        //     </Text>
        //     <Text>
        //         at {new Date(createdAt).toLocaleString()}
        //     </Text>

        //     <Text>
        //         Prediction ROI: x2
        //     </Text>
        //     <Text>
        //         Closing at {new Date(predictionDeadline).toLocaleString()}
        //     </Text>
        //     <HStack>
        //         <Text>Hey: {pair} {feed.answerToNumber / DIVISOR}</Text>
        //     </HStack>


        // </VStack>
    )
}
export default BetCard;