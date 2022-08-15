import { Flex, HStack, Text, VStack, Image, Button, Tooltip, Link, ScaleFade, Box } from "@chakra-ui/react";
import { DIVISOR } from "../../lib/constants";
import { getCurrenciesFromPairs, roundOff } from "../../lib/solHelpers";
import { useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import placeholder from "../../assets/logos/placeholder.png";

const BetCard = ({ prediction, feed }) => {
    const { pair, predictionPrice, predictionDeadline, expiryTime, ROI, direction, createdAt } = prediction;
    
    // get currencies from pair and link to their respective data feeds on https://data.chain.link/ 
    const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);
    const pairURL = `https://data.chain.link/ethereum/mainnet/crypto-usd/${firstCurrency}-${secondCurrency}`.toLowerCase();

    // get logo of token
    const logoImage = require(`../../assets/logos/${firstCurrency.toLowerCase()}.png`);

    // data is added to betslip when user clicks on place bet button
    const { setBetslip } = useContext(UserDataContext);
    const placeBet = () => {
        document.getElementById('bet-tabs').scrollIntoView({ behavior: 'smooth' });
        setBetslip({
            prediction, 
            firstCurrency,
            secondCurrency,
            logoImage,
            direction,
            ROI
        })
    }

    return (
        <Box
            minWidth="250px"
            maxWidth={["100%", "100%", "100%", "100%", "300px"]}
            flexGrow={1}
        >
            <ScaleFade 
                in={true} 
                initialScale={0.5}
            >
                <Flex 
                    borderRadius="20px"
                    bg="gray.800"
                    p="16px"
                    gap="32px"
                    alignItems="flex-start"
                    direction="column"
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
                                <Text fontWeight={700} fontSize="md" >
                                    {firstCurrency}
                                </Text>
                                <Text fontSize="sm">
                                    will settle
                                </Text>
                                <Text fontSize="sm" color={ direction ? 'green.200' : 'pink.200' } >
                                    { direction ? 'above' : 'below' } 
                                </Text>
                            </HStack>
                            <HStack spacing={1} alignItems="flex-end">
                                <Text fontWeight={700} fontSize="md" >
                                    {roundOff((predictionPrice / DIVISOR), 3)}  {secondCurrency}
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
                            bg={ direction ? 'green.900' : 'pink.900' } 
                            justify="center"
                            alignItems="center"
                        >   
                            {
                                direction 
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
                                <Tooltip label={`Price @ ${new Date(createdAt).toLocaleString()} from Chainlink Oracle`}>
                                    <Text fontWeight={500} textDecorationLine="underline" fontSize="xs" color="gray.500">
                                        { feed ? roundOff((feed.answerToNumber / DIVISOR), 4) : "-" }
                                    </Text>
                                </Tooltip>
                            </HStack>
                            <Link href={`${pairURL}`} isExternal>
                                <ArrowUpIcon size="xs" color="gray.500" transform="rotate(45deg)" />
                            </Link>
                        </HStack>

                        <Button
                            width="100%"
                            rounded="md"
                            size="sm"
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
                            disabled={new Date(predictionDeadline) < Date.now()}
                            onClick={placeBet}
                        >
                            Make a bet
                        </Button>
                    </VStack>
                </Flex>
            </ScaleFade>
        </Box>
    )
}
export default BetCard;