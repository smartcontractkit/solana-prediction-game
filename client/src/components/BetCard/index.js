import { Flex, HStack, Text, VStack, Image, Button } from "@chakra-ui/react";
import { getCurrenciesFromPairs } from "../../helpers/sol_helpers";
import { DIVISOR } from "../../lib/constants";
import { roundOff } from "../../helpers/sol_helpers";
import { useContext } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { UserDataContext } from "../../contexts/UserDataProvider";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import placeholder from "../../assets/logos/placeholder.png";

const BetCard = (predictionData) => {
    const ROI = 2;
    const { attributes, createdAt } = predictionData;
    const { pair, prediction, openingPredictionPrice, predictionDeadline, expiryTime, status } = attributes;
    const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);
    const logoImage = require(`../../assets/logos/${firstCurrency.toLowerCase()}.png`);

    const { setBetSlip } = useContext(UserDataContext);
    const { dataFeeds } = useContext(SocketContext);
    const feed = dataFeeds.find(data => data.pair === pair);
    
    if(!feed) {
        return null;
    }

    let isIncrease = openingPredictionPrice <= prediction;

    const placeBet = () => {
        setBetSlip({
            predictionData,
            firstCurrency,
            secondCurrency,
            logoImage,
            isIncrease,
            ROI
        })
    }

    return (
        <Flex
            borderRadius="20px"
            bg="gray.800"
            p="16px"
            gap="32px"
            minWidth="250px"
            maxWidth={["100%", "100%", "100%", "300px"]}
            alignItems="flex-start"
            direction="column"   
            flexGrow={[1, 1, 1, 1]}
        >
            <HStack
                padding="0px"
                gap="4px"
                isolation="isolate"
                alignSelf="stretch"
                justify="space-between"
            >
                <VStack
                    alignItems="flex-start"
                >   
                    <HStack spacing={1} alignItems="flex-end">
                        <Text fontWeight={700} fontSize="sm" >
                            {firstCurrency}
                        </Text>
                        <Text fontSize="xs">
                            will settle at
                        </Text>
                        <Text fontWeight={700} fontSize="sm" >
                            {roundOff((prediction / DIVISOR), 3)}  {secondCurrency}
                        </Text>
                    </HStack>
                    <HStack spacing={1} alignItems="flex-end">
                        <Text fontSize="xs" color={ isIncrease ? 'green.200' : 'pink.200' } >
                            { isIncrease ? 'above' : 'below' } 
                        </Text>
                        <Text as="span" mt="0px!important" fontWeight={700} fontSize="sm" >
                            {roundOff((openingPredictionPrice / DIVISOR), 3)}  {secondCurrency}
                        </Text>
                    </HStack>
                    <Text fontWeight={500} fontSize="xs" color="gray.500">
                        at {new Date(createdAt).toLocaleString()}
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
                    
            <VStack
                alignItems="flex-start"
                width="100%"    
            >
                <VStack
                    alignItems="flex-start"
                >   
                    <HStack>
                        <Text fontWeight={500} fontSize="xs" color="gray.500">
                            Prediction ROI
                        </Text>
                        <Text fontWeight={700} fontSize="xs" color="blue.200">
                            {ROI}x
                        </Text>
                    </HStack>
                    <Text fontWeight={500} fontSize="xs" color="gray.500">
                        Closing at {new Date(expiryTime).toLocaleString()}
                    </Text>
                </VStack>

                <HStack
                    py="4px"
                    px="12px"
                    bg="whiteAlpha.50"
                    borderRadius="6px"
                    alignItems="center"
                    justify="space-between"
                    width="100%"
                >
                    <Image
                        borderRadius='full'
                        boxSize='24px'
                        src={logoImage}
                        fallbackSrc={placeholder}
                        alt={pair}
                    />
                    <HStack
                        width="180px"
                        justify="space-between"
                    >
                        <Text fontWeight={500} fontSize="xs" color="gray.500">
                            {pair}
                        </Text>
                        <Text fontWeight={500} textDecorationLine="underline" fontSize="xs" color="gray.500">
                            {roundOff((feed.answerToNumber / DIVISOR), 4)}
                        </Text>
                    </HStack>
                    <ArrowUpIcon size="xs" color="gray.500" transform="rotate(45deg)" />
                </HStack>

                <Button
                    width="100%"
                    rounded="md"
                    color="blue.200"
                    border="1px solid"
                    borderColor="blue.200"
                    _hover={{
                        bg: "blue.200",
                        color: "gray.900",
                    }}
                    _click={{
                        bg: "blue.200",
                        color: "gray.900",
                    }}
                    disabled={!status && predictionDeadline > Date.now()}
                    onClick={placeBet}
                >
                    Place bet
                </Button>
            </VStack>

        </Flex>
    )
}
export default BetCard;