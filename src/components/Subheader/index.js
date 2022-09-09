import { ArrowUpIcon } from "@chakra-ui/icons";
import { Button, Flex, Hide, HStack, Image, Stack, Text } from "@chakra-ui/react";
import CountdownTimer from "./CountdownTimer";
import chainlinkLogo from "../../assets/logos/chainlink.svg";
import { useEffect, useState } from "react";

const NextPredictionTimer = () => {
    const date = new Date();
    const [predictionTime, setPredictionTime] = useState(date.getTime() + (60000 * (60 - (date.getMinutes() % 60))));

    useEffect(() => {
        window.nextPredictionInterval = setInterval(
            () => {
                let currentDate = new Date();
                if(currentDate.getMinutes() % 60 === 0) {
                    setPredictionTime(new Date(new Date().getTime() + (60000 * 60)));
                    return
                }
                return
            },
            60000 
        )
        return () => {
            clearInterval(window.nextPredictionInterval)
        }
    }, []);
  
    return (
      <Flex
        w="100%"
        justifyContent={["space-between", "space-between", "flex-start", "flex-start"]}
      >
        <Text>
          Next prediction in:&nbsp;
        </Text>
        <CountdownTimer 
          targetDate={predictionTime} 
          color={"yellow.400"} 
          fontWeight={"bold"} />
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
