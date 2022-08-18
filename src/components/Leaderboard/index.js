import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import { getTruncatedAddress } from "../../lib/solHelpers";

const UserLeaderBoard = ({ rank, address, winRate}) => {
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

const Leaderboard = () => {
    const users = [
        { rank: 1, address: "0asdfasdfasdfx1", winRate: "50" },
        { rank: 2, address: "0asdfasdfasdfx1", winRate: "30" },
        { rank: 3, address: "0asdfasdfasdfx1", winRate: "10" },
        { rank: 4, address: "0asdfasdfasdfx1", winRate: "50" },
        { rank: 5, address: "0asdfasdfasdfx1", winRate: "100" }
    ]
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
            {
                users.map((user, index) => {
                    return (
                        <UserLeaderBoard 
                            key={index}
                            rank={user.rank}  
                            address={user.address}
                            winRate={user.winRate}
                        />
                    )
                })
            }
        </VStack>
    )
}

export default Leaderboard;