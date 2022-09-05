import { Box, Flex, Heading, HStack, Image, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react"
import logo from "../../assets/logos/logo.svg";
import solanaLogo from "../../assets/logos/sol.png";

const Banner = () => {
    const wallets = [ 
        'phantom', 
        'solfare', 
        'torus',
        'coinbase',
        'glow',
        'slope'
    ];

    const faucets = [
        'solfare',
        'glow',
        'slope'
    ]

    const devLinks = [
        {
            href: "https://github.com/thisdot/blockchain-prediction-game/blob/main/README.md",
            text: "How to get started"
        },
        {
            href: "https://github.com/thisdot/blockchain-prediction-game",
            text: "Browse the Code"
        },
        {
            href: "https://solanacookbook.com/",
            text: "Solana Cookbook"
        },
        {
            href: "https://docs.chain.link/docs/solana/data-feeds-solana/",
            text: "Solana Chainlink Docs"
        }
    ]

    return (
        <Flex 
            w="100%"
            bg="gray.700"
            alignItems="center"
            justifyContent="center"
            py={["32px", "32px", "32px", "96px"]}
            px={["32px", "32px", "32px", "8px"]}
        >
            <Flex 
                direction={["column", "column", "column", "row"]}
                maxWidth="1300px"
                w="100%"
                justifyContent="space-around"
                alignItems={["center", "center", "center", "stretch"]}
                gap="48px"
            >   
                {/* section 1 */}
                <Flex
                    alignItems="flex-start"
                    flex="0 1 100%"
                    w="100%"
                >
                    <VStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        w="100%"
                        h="100%"
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
                                w="100%"
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
                </Flex>
                {/* sectioni 2 */}
                <Flex
                    alignItems="flex-start"
                    justifyContent="center"
                    flex="0 1 100%"
                    w="100%"
                    borderLeft={["", "", "", "1px solid rgba(255, 255, 255, 0.16)"]}
                >
                    <VStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        w="100%"
                        h="100%"
                        pl={["0px", "0px", "0px", "40px"]}
                        gap="8px"
                    >
                        <Text 
                            size="lg" 
                            pb="4px"
                            fontSize="18px"
                            fontWeight="600"
                            color="white"
                        >
                            How to get started?
                        </Text>
                        <Text color="gray.300">1. Install & connect a wallet</Text>
                        <HStack
                            w="100%"
                            bg="whiteAlpha.50"
                            p="8px 12px"
                            alignItems="center"
                            borderRadius="6px"
                            justifyContent="space-between"
                        >
                            <Text size="xs" color="gray.500">
                                Wallets
                            </Text>
                            <HStack>
                                {
                                    wallets.map(wallet => {
                                        const walletImage = require(`../../assets/logos/${wallet}.svg`);
                                        return (
                                            <Image
                                                key={wallet}
                                                borderRadius='full'
                                                boxSize='24px'
                                                src={walletImage}
                                                alt={`${wallet} logo`}
                                            />
                                        )
                                    })
                                }
                            </HStack>
                        </HStack>
                        <Text color="gray.300">2. Get some SOL’s from the faucets</Text>
                        <HStack
                            w="100%"
                            bg="whiteAlpha.50"
                            p="8px 12px"
                            alignItems="center"
                            borderRadius="6px"
                            justifyContent="space-between"
                        >
                            <Text size="xs" color="gray.500">
                                Faucets
                            </Text>
                            <HStack>
                                {
                                    faucets.map(faucet => {
                                        const faucetImage = require(`../../assets/logos/${faucet}.svg`);
                                        return (
                                            <Image
                                                key={faucet}
                                                borderRadius='full'
                                                boxSize='24px'
                                                src={faucetImage}
                                                alt={`${faucet} logo`}
                                            />
                                        )
                                    })
                                }
                            </HStack>
                        </HStack>
                        <Text color="gray.300">3. Choose a prediction & make a bet</Text>
                        <Text color="gray.300">4. Withdraw your winning! If you were right :) </Text>
                    </VStack>
                </Flex>
                {/* section 3 */}
                <Flex
                    alignItems="flex-start"
                    justifyContent="center"
                    flex="0 1 100%"
                    w="100%"
                    borderLeft={["", "", "", "1px solid rgba(255, 255, 255, 0.16)"]}
                >
                    <VStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        w="100%"
                        h="100%"
                        pl={["0px", "0px", "0px", "40px"]}
                    >
                        <VStack
                            alignItems="flex-start"
                        >
                            <Text 
                                size="lg" 
                                pb="4px"
                                fontSize="18px"
                                fontWeight="600"
                            >
                                For Developers
                            </Text>

                            <Text color="gray.300">
                                PD is built on top of Solana, that enables users from any corner of the world to trade and interact markets using trustless solutions.
                            </Text>
                        </VStack>
                        <UnorderedList>
                        {
                            devLinks.map((link, i) => (
                                <ListItem key={i}>
                                    <Link href={link.href} isExternal>
                                        <Text color="gray.300" textDecorationLine="underline">{link.text}</Text>
                                    </Link>
                                </ListItem>
                            ))
                        }
                        </UnorderedList>
                    </VStack>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Banner;