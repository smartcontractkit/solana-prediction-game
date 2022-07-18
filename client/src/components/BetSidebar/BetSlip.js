import { Flex, HStack, Image, Input, InputGroup, InputRightAddon, NumberInput, NumberInputField, Text, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import emptyBetSlip from '../../assets/bets/empty-betslip.svg'
import { BetDataContext } from "../../contexts/BetDataProvider";
import CreateBetButton from "../CreateBetButton";
import placeholder from "../../assets/logos/placeholder.png";
import { CloseIcon } from "@chakra-ui/icons";
import { UserDataContext } from "../../contexts/UserDataProvider";

const BetSlip = () => {

    const { betSlip } = useContext(BetDataContext);
    const { userData } = useContext(UserDataContext);

    const [ amount, setAmount ] = useState(0);

    if(!betSlip && !betSlip.betSlip) {
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

    console.log(betSlip);

    // const { id, attributes, createdAt } = betSlip;
    // const { pair, prediction, predictionDeadline, expiryTime, status } = attributes;

    return (
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
                            src={placeholder}
                            fallbackSrc={placeholder}
                            alt={"SOL/USD"}
                        />
                        <Text fontWeight={600} fontSize="sm" color="gray.200">
                            SOL/USD
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
                    >   
                        <CloseIcon 
                            w="9px" 
                            h="9px" 
                            color="gray.500"
                        />
                    </Flex>
                </HStack>
                <Text textAlign="left">
                    TRON will settle above 6.30 USD at Jul 5, 2022 11:00 PM (GMT +3)
                </Text>
                <Text textAlign="left">
                    Prediction ROI 1.45x
                </Text>
            </VStack>
            <InputGroup 
                size='sm' 
                rounded="md" 
                border="1px solid" 
                borderColor="whiteAlpha.50"
                _focus={{
                    border: "1px solid",
                    borderColor: "whiteAlpha.100"
                }}
            >
                <NumberInput 
                    max={10} 
                    min={0.1} 
                    placeholder="Bet Amount" 
                    rounded="md" 
                    border="1px solid" 
                    borderColor="whiteAlpha.50"
                    _focus={{
                        border: "1px solid",
                        borderColor: "whiteAlpha.100"
                    }}
                >
                    <NumberInputField id='amount' />
                </NumberInput>
                <InputRightAddon bg="whiteAlpha.200" children='SOL' />
            </InputGroup>
            <HStack
                justify="space-between"
            >
                <Text fontSize="14px" fontWeight={500} color="gray.400">
                    Balance:
                </Text>
                <Text fontSize="14px" fontWeight={700} color="whiteAlpha.800">
                    0.00
                </Text>
            </HStack>
            <HStack
                justify="space-between"
            >
                <Text fontSize="14px" fontWeight={500} color="gray.400">
                    Possible win:
                </Text>
                <Text fontSize="14px" fontWeight={700} color="green.200">
                    0.00 SOL
                </Text>
            </HStack>
            <CreateBetButton
                width="100%"
                rounded="md"
                color="blue.200"
                border="1px solid"
                borderColor="blue.200"
                _hover={{
                    bg: "blue.200",
                    color: "gray.900",
                }}
                _click={{
                    bg: "blue.200",
                    color: "gray.900",
                }}
                // disabled={!status && predictionDeadline < Date.now()}
                disabled
                // predictionId={id}
                amount={amount}
            />
        </VStack>
    )
}

export default BetSlip;