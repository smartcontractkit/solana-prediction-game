import { ArrowUpIcon } from "@chakra-ui/icons";
import { Button, Flex, Hide, HStack, Image, Stack, Text } from "@chakra-ui/react";
import chainlinkLogo from "../../assets/logos/chainlink.svg";

const NextPredictionTimer = () => {
    return (
      <Flex
        w="100%"
        justifyContent={["space-between", "space-between", "flex-start", "flex-start"]}
      >
        <Text>
          Next prediction in:&nbsp;
        </Text>
        <Text display={"flex"}>
            New prediction live <Text color="yellow.400" ml="0.2rem" fontWeight="bold">every hour</Text>, place your bet <Text color="yellow.400" ml="0.2rem" fontWeight="bold">now</Text>
        </Text>
      </Flex>
    );
}

const ChainlinkFeedButton = () => {
    return (
        <Button
            size="md"
            rounded="md"
            bg="whiteAlpha.50"
            minWidth="min-content"
            _hover={{
                bg: "whiteAlpha.300",
            }}
            onClick={() => {
                window.open("https://data.chain.link", "_blank");
            }}
        >
            <Stack
                spacing={[2, 4, 8, 8]}
                align="center"
                justify="space-between"
                direction="row"
                py="8px"
                px="4px"
            >
            <HStack>
                <Text color="gray.500" fontWeight={500}>
                    Live prices from Chainlink
                </Text>
                <Image
                    borderRadius='full'
                    boxSize='24px'
                    src={chainlinkLogo}
                    alt="Chainlink"
                />
                <Text color="gray.400" fontWeight={700}>
                    Data Feeds
                </Text>
            </HStack>
            <ArrowUpIcon w="16px" h="16px" color="gray.500" transform="rotate(45deg)" />
            </Stack>
        </Button>
    );
}

const Subheader = () => {
    return (
        <HStack
            alignItems="center"
            justifyContent="space-between"
            width="100%"
        >
            <NextPredictionTimer />
            <Hide below="md">
                <ChainlinkFeedButton />
            </Hide>
        </HStack>
    );
}

export default Subheader;
