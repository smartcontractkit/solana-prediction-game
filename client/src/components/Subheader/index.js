import { ArrowUpIcon } from "@chakra-ui/icons";
import { Button, Flex, HStack, Image, Show, Stack, Text } from "@chakra-ui/react";
import CountdownTimer from "./CountdownTimer";
import chainlinkLogo from "../../assets/logos/chainlink.svg";

const NextPrediction = () => {
    const predictionTime = new Date().setUTCHours(24,0,0,0); // TODO to be changed to next prediction time
  
    return (
      <Flex
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
            size="sm"
            rounded="md"
            bg="whiteAlpha.50"
            _hover={{
                bg: "whiteAlpha.300",
            }}
            >
            <Stack
                spacing={[2, 4, 8, 8]}
                align="center"
                justify="space-between"
                direction="row"
            >
                
                <Text color="gray.500">
                    Live prices from
                </Text>
                <Image
                    borderRadius='full'
                    boxSize='24px'
                    src={chainlinkLogo}
                    alt="Chainlink"
                />
                <ArrowUpIcon size="xs" color="gray.500" transform="rotate(45deg)" />
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
            <NextPrediction />
            <Show above="sm">
                <ChainlinkFeedButton />
            </Show>
        </HStack>
    );
}

export default Subheader;