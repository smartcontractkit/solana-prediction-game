import { HStack, Text, VStack } from "@chakra-ui/react";
import { getCurrenciesFromPairs } from "../../helpers/sol_helpers";
import { DIVISOR } from "../../lib/constants";
import { roundOff } from "../../helpers/sol_helpers";
import { useContext } from "react";
import { SocketContext } from "../../providers/SocketProvider";

const BetCard = ({ id, attributes, createdAt, updatedAt }) => {
    const { account, pair, prediction, predictionDeadline } = attributes;
    const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);

    const { dataFeeds } = useContext(SocketContext);
    const feed = dataFeeds.find(data => data.pair === pair);
    
    if(!feed) {
        return null;
    }

    const price = roundOff((prediction / DIVISOR), 2);

    return (
        <VStack>
            <Text>
                {`${firstCurrency} will settle above ${price}${secondCurrency}`}
            </Text>
            <Text>
                at {new Date(createdAt).toLocaleString()}
            </Text>

            <Text>
                Prediction ROI: x2
            </Text>
            <Text>
                Closing at {new Date(predictionDeadline).toLocaleString()}
            </Text>
            <HStack>
                <Text>Hey: {pair} {feed.answerToNumber / DIVISOR}</Text>
            </HStack>


        </VStack>
    )
}
export default BetCard;