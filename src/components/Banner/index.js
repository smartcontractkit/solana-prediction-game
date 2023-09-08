import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import logo from "../../assets/logos/logo.svg";
import solanaLogo from "../../assets/logos/sol.png";
import GetStartedList from "./GetStartedList";
import { GithubIcon } from "./GithubIcon";
const { REACT_APP_GITHUB_URL: GITHUB_URL } = process.env;

const Banner = () => {
  const wallets = [
    {
      name: "phantom",
      extension: ".svg",
      link: "https://phantom.app",
    },
    {
      name: "solfare",
      extension: ".svg",
      link: "https://solflare.com",
    },
    {
      name: "glow",
      extension: ".svg",
      link: "https://glow.app/",
    },
    {
      name: "slope",
      extension: ".svg",
      link: "https://slope.finance/",
    },
  ];

  const faucets = [
    {
      name: "sol-faucet",
      extension: ".png",
      link: "https://solfaucet.com/",
    },
    {
      name: "spl-token-faucet",
      extension: ".png",
      link: "https://spl-token-faucet.com/",
    },
  ];

  const devLinks = [
    {
      href: `${GITHUB_URL}/blob/main/README.md`,
      text: "How to get started",
    },
    {
      href: "https://docs.chain.link/docs/solana/data-feeds-solana/",
      text: "Solana Chainlink Docs",
    },
    {
      href: "https://docs.solana.com/developing/clients/javascript-api",
      text: "Solana Web3.js Javascript API",
    },
  ];
  const getStarted = [
    {
      name: "Wallets",
      description: "1. Install & connect a wallet",
      logos: wallets,
    },
    {
      name: "Faucets",
      description: "2. Get some devnet SOL from the faucets",
      logos: faucets,
    },
    {
      name: null,
      description: "3. Choose a prediction & make a bet",
      logos: null,
    },
    {
      name: null,
      description: "4. Withdraw winnings or keep playing",
      logos: null,
    },
  ];
  return (
    <Flex
      w="100%"
      bg="gray.700"
      alignItems="center"
      justifyContent="center"
      py={["32px", "32px", "32px", "432x"]}
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
        <Flex alignItems="flex-start" flex="0 1 100%" w="100%">
          <VStack
            justifyContent="space-between"
            alignItems="flex-start"
            w="100%"
            h="100%"
          >
            <HStack h="80px" p={0}>
              <Image boxSize="80px" src={logo} alt="Logo" />
              <Heading
                fontSize="30px"
                lineHeight="1.2"
                letterSpacing="-0.03em"
                fontWeight="600"
              >
                Solana
                <br />
                Prediction Game
              </Heading>
            </HStack>
            <VStack w="100%">
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
                  ></Box>
                  <Text size="xs">Live on Solana Devnet</Text>
                </HStack>

                <Image
                  borderRadius="full"
                  boxSize="24px"
                  src={solanaLogo}
                  alt="solana logo"
                />
              </HStack>
              <VStack
                borderRadius="6px"
                borderColor="purple.400"
                bg="whiteAlpha.100"
                p="12px"
                alignItems="flex-start"
                w="100%"
              >
                <Text color="purple.400" fontWeight="600" fontSize="12px">
                  Disclaimer
                </Text>
                <Text color="white">
                  This dApp has been developed for educational purposes and it
                  is not meant to be used for gambling
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
            pl={["0px", "0px", "0px", "30px"]}
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
            {getStarted.map((list, i) => (
              <GetStartedList
                key={i}
                name={list.name}
                description={list.description}
                logos={list.logos}
              />
            ))}
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
            pl={["0px", "0px", "0px", "30px"]}
          >
            <VStack alignItems="flex-start">
              <Text size="lg" pb="4px" fontSize="18px" fontWeight="600">
                For Developers
              </Text>

              <Text color="gray.300">
                This dApp is built on top of Solana and Chainlink. It enables
                users to interact with real-time markets using trustless
                solutions. Learn how to build a full-stack dApp with Solana and
                Chainlink.
              </Text>

              <Link href={GITHUB_URL} isExternal>
                <HStack
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  padding="8px"
                >
                  <GithubIcon boxSize="24px" />
                  <Text fontWeight="bold">Go to Repository</Text>
                </HStack>
              </Link>
            </VStack>
            <Box>
              <UnorderedList listStylePosition="outside">
                {devLinks.map((link, i) => (
                  <ListItem key={i}>
                    <Link href={link.href} isExternal display="block">
                      <Text color="gray.300" textDecorationLine="underline">
                        {link.text}
                      </Text>
                    </Link>
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Banner;
