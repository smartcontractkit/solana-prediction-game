import { Avatar, HStack, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import { getTruncatedAddress } from "../../lib/solHelpers";

const UserLeaderBoard = ({ rank, address, winRate }) => {
    return (
        <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            borderBottom="1px solid"
            borderColor="whiteAlpha.300"
            padding={2}
            _last={{
                borderBottom: "none"
            }}
        >
            <HStack
                gap={2}
            >
                <Text
                    size="xs"
                    fontWeight="500"
                    color="gray.400"
                >
                    { rank }
                </Text>
                <Avatar size="xs" bg='red.500' src={`https://api.multiavatar.com/${address}.png`} />
                <Text
                    size="xs"
                    fontWeight="500"
                    color="gray.400"
                >
                    { getTruncatedAddress(address) }
                </Text>
            </HStack>
            <Text 
                size="xs"
                fontWeight="600"
                color="gray.200"
            >
                { winRate }%
            </Text>
        </HStack>
    )
}


const LeaderboardSkeleton = () => Array(5).fill(0).map((_, index) => {
    return (
        <VStack
            w="100%"
            key={index}
        >
            <HStack
                w="100%"
                justifyContent="space-between"  
                opacity={0.3} 
            >
                <HStack
                    gap={2} 
                >
                    <Skeleton height="10px" width="20px" />
                    <SkeletonCircle boxSize="14px" />
                    <Skeleton height="10px" width="50px" />
                </HStack>
                <Skeleton height="10px" width="30px" />
            </HStack>
        </VStack>
    )
});

const Leaderboard = () => {
    const [usersLeaderboard, setUsersLeaderboard] = useState(null);

    useEffect(() => {
        axiosInstance
            .get(`/api/users/leaderboard`)
            .then(res => res.data)
            .then(data => {
                setUsersLeaderboard(data);
            })
            .catch(err => {
                console.error("Failed to get users, with error code: " + err.message);
            });
    }, []);


    const LeaderBoardContent = () => {
        if(!usersLeaderboard) {
            return LeaderboardSkeleton();
        }

        return usersLeaderboard.map((user, index) => {
            return (
                <UserLeaderBoard
                    key={index}
                    rank={index + 1}
                    address={user.address}
                    winRate={user.winRate}
                />
            )
        })
    }


    return (
        <VStack
            w="100%"
            gap={2}
        >
            <HStack
                justifyContent="space-between"
                alignItems="center"
                w="100%"
            >
                <Text
                    size="sm"
                    fontWeight="700"
                >
                    Leaderboard
                </Text>
                <Text
                    size="xs"
                    fontWeight="500"
                    color="gray.500"
                >
                    by Win Rate 
                </Text>
            </HStack>
            <LeaderBoardContent />
        </VStack>
    )
}

export default Leaderboard;