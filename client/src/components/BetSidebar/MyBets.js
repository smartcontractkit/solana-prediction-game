import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import axiosInstance from "../../helpers/axiosInstance";
import emptyBets from '../../assets/bets/empty-bets.svg'
import placeholder from "../../assets/logos/placeholder.png";
import { getCurrenciesFromPairs, roundOff } from "../../helpers/sol_helpers";
import { DIVISOR } from "../../lib/constants";

const MyBets = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ bets, setBets ] = useState([]);

    const { address } = useContext(UserDataContext);

    useEffect(() => {
        axiosInstance.get(`/getUserBets/${address}`)
          .then(res => res.data)
          .then(data => {
            setBets(data);
            setIsFetching(false);
          })
          .catch(err => {
            setIsFetching(false);
            alert("Error occured: " + err.message);
          });
    }, [address]);

    if(isFetching) {
        return <div>Loading...</div>
    }

    if(bets.length === 0) {
        <VStack>
            <Image src={emptyBets} height="64px" alt="empty bet slip" my="10px" />
            <Text fontWeight={700} color="gray.200">
                No bets here yet
            </Text>
            <Text color="gray.500">
                Make your first one and it will appear here.
            </Text>
        </VStack>
    }

    const withdraw = () => {
        console.log("Withdrawing");
        // TODO: Withdraw amount won
    }


    const SingleBetCard = ({ bet }) => {
        const { parent, amount, status } = bet;
        const { pair, prediction, expiryTime } = parent;
        const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);
        const logoImage = require(`../../assets/logos/${firstCurrency.toLowerCase()}.png`);

        let statusText = "";
        let statusColor = "";

        switch(status) {
            case "open":
                statusText = "ONGOING";
                statusColor = "orange.300";
                break;
            case "won":
                statusText = "WIN";
                statusColor = "green.400";
                break;
            case "lost":
                statusText = "LOST";
                statusColor = "red.500";
                break;
            default:
                statusText = "ONGOING";
                statusColor = "orange.300";
        }

        return (
            <VStack
                rounded="md"
                bg="whiteAlpha.100"
                alignItems="flex-start"
                p="12px"
                gap="8px"
                w="100%"
            >
                <HStack
                    borderRadius="6px"
                    alignItems="center"
                    justify="space-between"
                    w="100%"
                >
                    <HStack>
                        <Image
                            borderRadius='full'
                            boxSize='24px'
                            src={logoImage}
                            fallbackSrc={placeholder}
                            alt={pair}
                        />
                        <Text fontWeight={600} fontSize="12px" color="gray.200">
                            {pair}
                        </Text>
                    </HStack>
                    <Text fontWeight={600} fontSize="12px" color={statusColor}>
                        {statusText}
                    </Text>
                </HStack>
                <Text textAlign="left">
                    {firstCurrency} will settle at {roundOff((prediction / DIVISOR), 5)} {secondCurrency} at {new Date(expiryTime).toLocaleString()}
                </Text>
                <HStack textAlign="left">
                    <Text fontWeight={500} fontSize="xs" color="gray.500">
                        Bank:
                    </Text>
                    <Text fontWeight={700} fontSize="xs" color="purple.200">
                        { amount * 2 } SOL
                    </Text>
                </HStack>
                <HStack
                    w="100%"
                >
                    <Button
                        w="41px"
                        h="24px"
                        fontSize="12px"
                        minW="min-content"
                        variant="outline"
                        py="4px"
                        borderRadius="6px"
                        flexGrow={1}
                    >   
                        Details
                    </Button>
                    {
                        status === "won" && (
                            <Button
                                w="41px"
                                h="24px"
                                fontSize="12px"
                                minW="min-content"
                                variant="outline"
                                px="4px"
                                borderRadius="6px"
                                flexGrow={1}
                                color="gray.800"
                                bg="green.200"
                                onClick={withdraw}
                            >
                                Withdraw
                            </Button>
                        )
                    }
                </HStack>

            </VStack>
        )
    }


    return (
        <VStack 
            gap="16px"
        >
            <HStack
                align="center"
                justify="space-between"
                w="100%"
            >
                <Text fontWeight={700} color="gray.200">
                    {bets.length} bets
                </Text>
                <Text color="gray.500">
                    Win Rate: 45%
                </Text>
            </HStack>
            <VStack
                gap="8px"
                w="100%"
                maxH="600px"
                overflowY="scroll"
            >
                {bets.map(bet => (
                    <SingleBetCard bet={bet} key={bet.objectId}/>
                ))}
            </VStack>
        </VStack>
    )
}

export default MyBets;