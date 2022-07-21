import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import axiosInstance from "../../helpers/axiosInstance";
import emptyBets from '../../assets/bets/empty-bets.svg';
import SingleBetCard from "./SingleBetCard";

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

    const betsWon = bets.filter(bet => bet.status === "won").length;
    const winRate = betsWon.length / bets.length;

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
                    Win Rate: {winRate} %
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