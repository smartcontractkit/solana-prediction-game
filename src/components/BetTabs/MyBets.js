import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import emptyBets from '../../assets/bets/empty-bets.svg';
import SingleBetCard from "./SingleBetCard";
import { roundOff } from "../../helpers/solHelpers";

const MyBets = () => {

    const { myBets } = useContext(UserDataContext);

    if(!myBets) {
        return <div>Loading...</div>
    }

    if(myBets.length === 0) {
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

    const myBetsWon = myBets.filter(bet => bet.status === "won");
    const winRate = ((myBetsWon.length || myBets.length) === 0) ? 0 : roundOff(myBetsWon.length / myBets.length, 2) * 100;

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
                    {myBets.length} bets
                </Text>
                <Text color="gray.500">
                    Win Rate: {winRate}%
                </Text>
            </HStack>
            <VStack
                gap="8px"
                w="100%"
                maxH="508px"
                overflowY="auto"
            >
                {myBets.map(bet => (
                    <SingleBetCard bet={bet} key={bet._id}/>
                ))}
            </VStack>
        </VStack>
    )
}

export default MyBets;