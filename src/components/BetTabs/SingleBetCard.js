import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, HStack, Image, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import placeholder from "../../assets/logos/placeholder.png";
import { UserDataContext } from "../../contexts/UserDataProvider";
import axiosInstance from "../../lib/axiosInstance";
import { formatDate, getCurrenciesFromPairs, roundOff } from "../../lib/helpers";
import { DIVISOR } from "../../lib/constants";

const SingleBetCard = ({ bet }) => {
    const { prediction, amount, status, transactionSignature } = bet;
    const { pair, predictionPrice, expiryTime, direction, ROI } = prediction;
    const { address, betplaced, setBetPlaced } = useContext(UserDataContext);
    const { firstCurrency, secondCurrency } = getCurrenciesFromPairs(pair);
    const logoImage = require(`../../assets/logos/${firstCurrency.toLowerCase()}.png`);
    const [isSaving, setIsSaving] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const toast = useToast();

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
        case "completed":
            statusText = "COMPLETED";
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


    const network = process.env.REACT_APP_SOLANA_CLUSTER_NETWORK;

    const transactionUrl = `https://explorer.solana.com/tx/${transactionSignature}?cluster=${network}`;

    const withdraw = async () => {
        setIsSaving(true);
        setIsWithdrawing(true);
        toast({
            title: 'Withdrawing...',
            description: "Sending Solana to your account",
            status: 'info',
            duration: 9000,
            isClosable: true,
        })

        axiosInstance.post("/api/transactions/withdraw", {
            _id: bet._id,
            amount: amount * ROI,
            withdrawAddress: address
        })
        .then(res => res.data)
        .then(data => {
            setIsSaving(false);
            setBetPlaced(!betplaced);
            toast({
                title: 'Transaction complete',
                description: "Refreshing your account balance...",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        })
        .catch(err => {
            setIsSaving(false);
            setIsWithdrawing(false);
            toast({
                title: 'Error withdrawing funds',
                description: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        });  

    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    // show dialog to confirm bet creation
    const showDialog = (event) => {
        event.preventDefault();
        onOpen();
    }

    const WithdrawButton = () => {
        return (
            <>
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
                    onClick={showDialog}
                    isLoading={isSaving}
                    loadingText="Withdrawing..."
                    disabled={isWithdrawing}
                >
                    Withdraw
                </Button>
                <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    isOpen={isOpen}
                    isCentered
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent bg="gray.800">
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Withdraw
                            </AlertDialogHeader>
                
                            <AlertDialogBody>
                                You are withdrawing {amount * ROI} SOL 
                            </AlertDialogBody>
                
                            <AlertDialogFooter>
                                <Button colorScheme='red' ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button 
                                    color="gray.800"
                                    bg="green.200"
                                    onClick={withdraw} 
                                    isLoading={isSaving}
                                    loadingText="Withdrawing..."
                                    disabled={isWithdrawing}
                                    ml={3}
                                >
                                    Confirm
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
        );
    }

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
                {firstCurrency} will settle { direction ? 'above' : 'below' } {roundOff((predictionPrice / DIVISOR), 5)} {secondCurrency} on {formatDate(expiryTime)}
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
                        <WithdrawButton />
                    )
                }
            </HStack>

        </VStack>
    )
}

export default SingleBetCard;