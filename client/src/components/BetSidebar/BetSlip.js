import { Image, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import emptyBetSlip from '../../assets/bets/empty-betslip.svg'
import { BetDataContext } from "../../contexts/BetDataProvider";

const BetSlip = () => {

    const { betSlip } = useContext(BetDataContext);

    if(!betSlip) {
        return (
            <VStack>
                <Image src={emptyBetSlip} height="64px" alt="empty bet slip" my="10px" />
                <Text fontWeight={700} color="gray.200">
                    Betslip is empty
                </Text>
                <Text color="gray.500">
                    To add a bet to your betslip, please select a prediction from the list.
                </Text>
            </VStack>
        )
    }

    const { id, attributes, createdAt } = betSlip;
    const { pair, prediction, predictionDeadline, expiryTime, status } = attributes;

    return (
        <VStack>
            <Text fontWeight={700} color="gray.200">
                {id}
            </Text>
        </VStack>
    )
}

export default BetSlip;