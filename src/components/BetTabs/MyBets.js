import { HStack, Image, Skeleton, SkeletonCircle, SkeletonText, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import emptyBets from '../../assets/icons/empty-bets.svg';
import SingleBetCard from "./SingleBetCard";
import { roundOff } from "../../lib/helpers";
import WalletModalButton from "../WalletModalButton/WalletModalButton";
import { useWallet } from "@solana/wallet-adapter-react";

const MyBets = () => {

    const { myBets } = useContext(UserDataContext);
    const { connected } = useWallet();

    if(!connected){
        return (
            <VStack>
                <Image src={emptyBets} height="64px" alt="empty bet slip" my="10px" />
                <Text fontWeight={700} color="gray.200">
                    No bets here yet
                </Text>
                <Text color="gray.500">
                    Connect your wallet to see your bets.
                </Text>
                <WalletModalButton 
                    width="100%"
                    rounded="md"
                    color="gray.800"
                    bg="blue.200"
                    _hover={{
                        bg: "blue.100",
                    }}
                />
            </VStack>
        )
    }
    
    if(!myBets) {
        return (
            <VStack
                rounded="md"
                bg="whiteAlpha.100"
                alignItems="flex-start"
                p="12px"
                gap="8px"
                w="100%"
                boxShadow='lg' 
            >
                <SkeletonCircle boxSize='24px' opacity={0.3} />
                <SkeletonText noOfLines={1} spacing='4' opacity={0.3} w='100%' />
                <SkeletonText noOfLines={1} spacing='4' opacity={0.3} w='70%' />
                <SkeletonText noOfLines={1} spacing='4' opacity={0.3} w='100%' />
                <Skeleton height='32px' rounded="sm" opacity={0.3} w='100%' />
            </VStack>
        )
    }

    if(myBets.length === 0) {
        return (
            <VStack>
                <Image src={emptyBets} height="64px" alt="empty bet slip" my="10px" />
                <Text fontWeight={700} color="gray.200">
                    No bets here yet
                </Text>
                <Text color="gray.500">
                    Make a bet and it will appear here
                </Text>
            </VStack>
        )
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