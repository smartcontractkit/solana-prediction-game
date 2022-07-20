import { Image, Text, VStack } from "@chakra-ui/react";
import emptyBets from '../../assets/bets/empty-bets.svg'

const MyBets = () => {

    return (
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
}

export default MyBets;