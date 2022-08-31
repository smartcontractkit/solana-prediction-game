import { Flex, FormControl, HStack, Image, InputGroup, InputRightAddon, NumberInput, NumberInputField, ScaleFade, Text, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import emptyBetslip from '../../assets/icons/empty-betslip.svg';
import CreateBetButton from "./CreateBetButton";
import { CloseIcon } from "@chakra-ui/icons";
import { UserDataContext } from "../../contexts/UserDataProvider";
import { formatDate, roundOff } from "../../lib/helpers";
import { DIVISOR } from "../../lib/constants";
import placeholder from "../../assets/logos/placeholder.png";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletModalButton from "../WalletModalButton/WalletModalButton";

const Betslip = () => {

    const { connected } = useWallet();
    const { balance, betSlip, setBetslip, betPlaced, setBetPlaced } = useContext(UserDataContext);

    const [ amount, setAmount ] = useState(1);

    // show empty bet slip if no bets are placed
    if(!betSlip) {
        return (
            <VStack>
                <Image src={emptyBetslip} height="64px" alt="empty bet slip" my="10px" />
                <Text fontWeight={700} color="gray.200">
                    Betslip is empty
                </Text>
                <Text color="gray.500">
                    To add a bet to your betslip, please select a prediction from the list.
                </Text>
            </VStack>
        )
    }

    const { 
        prediction,
        firstCurrency,
        secondCurrency,
        logoImage,
        ROI,
    } = betSlip;
    const { _id, pair, predictionPrice, expiryTime, direction } = prediction;

    // show form errors when user tries to place bet with insufficient balance 
    // or with amount less than 0.1 SOL.
    // the minimum bet amount is 0.1 SOL.
    const isInsufficientBalance = amount >= balance;
    const isInsufficientAmount = amount < 0.1;
    const isError = connected ? isInsufficientBalance || isInsufficientAmount: false;

    // set betslip to empty if user clicks on close button
    const removeBet = () => {
        setBetslip(null);
    }

    // show connect button if user is not connected to a solana wallet
    const BottomButton = (props) => {
        return connected 
        ? (
            <CreateBetButton
                type="submit"
                disabled={isError}
                predictionId={_id}
                amount={amount}
                setBetslip={setBetslip}
                betPlaced={betPlaced}
                setBetPlaced={setBetPlaced}
                firstCurrency={firstCurrency}
                direction={direction}
                predictionPrice={`${roundOff((predictionPrice / DIVISOR), 3)}  ${secondCurrency}`}
                expiryTime={expiryTime}
                {...props}
            />
        )
        : (<WalletModalButton {...props} />)
        
    };

    return (
        <ScaleFade in={betSlip} initialScale={0.5}>
            <form w="100%">
                <VStack
                    gap="16px"
                    w="100%"
                    alignItems="stretch"
                >   
                    <VStack
                        rounded="md"
                        bg="whiteAlpha.100"
                        alignItems="flex-start"
                        p="12px"
                    >
                        <HStack
                            borderRadius="6px"
                            alignItems="center"
                            justify="space-between"
                            width="100%"
                        >
                            <HStack>
                                <Image
                                    borderRadius='full'
                                    boxSize='24px'
                                    src={logoImage}
                                    fallbackSrc={placeholder}
                                    alt={pair}
                                />
                                <Text fontWeight={600} fontSize="sm" color="gray.200">
                                    {pair}
                                </Text>
                            </HStack>
                            <Flex
                                alignSelf="flex-start" 
                                width="24px"
                                height="24px"
                                borderRadius="6px"
                                bg="whiteAlpha.50"
                                justify="center"
                                alignItems="center"
                                onClick={removeBet}
                            >   
                                <CloseIcon 
                                    w="9px" 
                                    h="9px" 
                                    color="gray.500"
                                />
                            </Flex>
                        </HStack>
                        <Text textAlign="left">
                            {firstCurrency} will settle at {roundOff((predictionPrice / DIVISOR), 3)} {secondCurrency} at {formatDate(expiryTime)}
                        </Text>
                        <HStack textAlign="left">
                            <Text fontWeight={500} fontSize="xs" color="gray.500">
                                Prediction ROI
                            </Text>
                            <Text fontWeight={700} fontSize="xs" color="blue.200">
                                {ROI}x
                            </Text>
                        </HStack>
                    </VStack>
                    <VStack>
                        <FormControl isRequired>
                            <InputGroup 
                                size='sm' 
                                rounded="md"
                            >
                                <NumberInput 
                                    disabled={!connected}
                                    max={10}
                                    min={0.1} 
                                    defaultValue={1} 
                                    precision={4}
                                    placeholder="Bet Amount" 
                                    rounded="md" 
                                    border="1px solid" 
                                    borderColor="whiteAlpha.50"
                                    borderRight="0px solid transparent"
                                    borderTopRightRadius={0}
                                    borderBottomRightRadius={0}
                                    flexGrow={1}
                                    isInvalid={isError}
                                    onChange={value => setAmount(Number(value))}
                                >
                                    <NumberInputField id='amount' />
                                </NumberInput>
                                <InputRightAddon 
                                    bg="whiteAlpha.200" 
                                    children='SOL'
                                    rounded="md" 
                                    border="1px solid" 
                                    borderColor="whiteAlpha.50"
                                    height="initial"
                                    opacity={!connected && 0.4} 
                                />
                            </InputGroup>
                        </FormControl>
                        {isError && (
                            <Text as="span" mt="0px!important" fontWeight={500} fontSize="xs" 
                                color="red.500" alignSelf="flex-start">
                                    {isInsufficientBalance ? 'Insufficient Balance' : 'Minimum of 0.1 SOL'}
                            </Text>               
                        )}
                    </VStack>
                    { connected && (
                        <HStack
                            justify="space-between"
                        >
                            <Text fontSize="14px" fontWeight={500} color="gray.400">
                                Balance:
                            </Text>
                            <Text fontSize="14px" fontWeight={700} color="whiteAlpha.800">
                                {balance ? `${roundOff(balance, 3)} SOL` : 'Loading...'}
                            </Text>
                        </HStack>
                        )
                    }
                    <HStack
                        justify="space-between"
                    >
                        <Text fontSize="14px" fontWeight={500} color="gray.400">
                            Possible win:
                        </Text>
                        <Text fontSize="14px" fontWeight={700} color="green.200">
                            {roundOff(amount * ROI, 3)} SOL
                        </Text>
                    </HStack>
                    <BottomButton 
                        width="100%"
                        rounded="md"
                        color="gray.800"
                        bg="blue.200"
                        _hover={{
                            bg: "blue.100",
                        }}
                    />
                </VStack>
            </form>
        </ScaleFade>
    )
}

export default Betslip;