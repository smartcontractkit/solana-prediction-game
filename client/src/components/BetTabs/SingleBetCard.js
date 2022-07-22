import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import placeholder from "../../assets/logos/placeholder.png";
import { getCurrenciesFromPairs, roundOff } from "../../helpers/sol_helpers";
import { DIVISOR } from "../../lib/constants";

const SingleBetCard = ({ bet }) => {
    const { prediction, amount, status, transactionSignature } = bet;
    const { pair, predictionPrice, expiryTime } = prediction;
    const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);
    const logoImage = require(`../../assets/logos/${firstCurrency.toLowerCase()}.png`);

    let statusText = "";
    let statusColor = "";

    switch(status) {
        case "ongoing":
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

    const withdraw = () => {
        console.log("Withdrawing");
        // TODO: Withdraw amount won
    }

    const network = WalletAdapterNetwork.Devnet;

    const transactionUrl = `https://explorer.solana.com/tx/${transactionSignature}?cluster=${network}`;

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
                {firstCurrency} will settle at {roundOff((predictionPrice / DIVISOR), 5)} {secondCurrency} at {new Date(expiryTime).toLocaleString()}
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
                    onClick={() => {
                        window.open(transactionUrl, "_blank");
                    }}
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

export default SingleBetCard;