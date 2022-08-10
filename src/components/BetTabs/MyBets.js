import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import emptyBets from '../../assets/icons/empty-bets.svg';
import SingleBetCard from "./SingleBetCard";
import { roundOff } from "../../helpers/solHelpers";

const MyBets = () => {

    const { myBets } = useContext(UserDataContext);
    
    const EmptyBets = () => (
        <VStack>
            <Image src={emptyBets} height="64px" alt="empty bet slip" my="10px" />
            <Text fontWeight={700} color="gray.200">
                No bets here yet
            </Text>
            <Text color="gray.500">
                Make your first one and it will appear here.
            </Text>
        </VStack>
    )

    if(!myBets) {
        return <EmptyBets />
    }

    if(myBets.length === 0) {
        return <EmptyBets />
    }


    const myBetsWon = myBets.filter(bet => (bet.status === "won" || bet.status === "completed"));
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