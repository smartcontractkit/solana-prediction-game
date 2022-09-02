import { Box, Flex, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react"
import logo from "../../assets/logos/logo.svg";
import solanaLogo from "../../assets/logos/sol.png";

const Banner = () => {
    return (
        <Flex 
            w="100%"
            bg="gray.700"
            alignItems="center"
            justifyContent="center"
            py="96px"
            px="8px"
        >
            <Flex 
                direction="row"
                maxWidth="1300px"
                w="100%"
                justifyContent="space-evenly"
                alignItems="flex-start"
                gap="48px"
            >
                <VStack
                    gap="51px"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    minW="300px"
                    maxW="360px"
                >
                    
                    <HStack
                        h="80px"
                        p={0}
                        >
                        <Image
                            boxSize='80px'
                            src={logo}
                            alt="Logo"
                        />
                        <Heading
                            fontSize="30px"
                            lineHeight="1.2"
                            letterSpacing="-0.03em" 
                            fontWeight="600"
                        >
                            Prediction <br/>
                            Game
                        </Heading>
                    </HStack>
                    <VStack
                        w="100%"
                    >
                        <HStack
                            w="100%"
                            bg="whiteAlpha.50"
                            p="4px 12px"
                            alignItems="center"
                            borderRadius="6px"
                            justifyContent="space-between"
                        >
                            <HStack gap="8px">
                                <Box 
                                    bg="green.500" 
                                    width="6px"
                                    height="6px"
                                    borderRadius="full" 
                                >
                                </Box>
                                <Text size="xs">
                                    Live on Solana Devnet
                                </Text>
                            </HStack>

                            <Image
                                borderRadius='full'
                                boxSize='24px'
                                src={solanaLogo}
                                alt='solana logo'
                            />
                        </HStack>
                        <VStack
                            borderRadius="6px"
                            borderColor="purple.400"
                            bg="whiteAlpha.100"
                            p="12px"
                            gap="8px"
                            alignItems="flex-start"
                        >
                            <Text
                                color="purple.400"
                                fontWeight="600"
                                fontSize="12px"
                            >
                                Disclaimer
                            </Text>
                            <Text
                                color="white"
                            >
                                This dApp has been developed for educational purposes and it is not meant to be used for gambling
                            </Text>
                        </VStack>
                    </VStack>
                </VStack>
                <VStack>
                    <Text>Hey</Text>
                </VStack>
                <VStack>
                    <Text>Hey</Text>
                </VStack>
            </Flex>
        </Flex>
    );
}

export default Banner;