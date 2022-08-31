import { Flex, Text } from "@chakra-ui/react"

const Banner = () => {
    return (
        <Flex 
            h="30vh"
            w="100%"
            bg="whiteAlpha.50"
            rounded="md"
            alignItems="center"
            direction="row"
            p={4}
        >
            <Text 
                fontSize="5xl" 
                fontWeight="700"
                lineHeight="1.2"
                color="gray.100"
            >
                Prediction <br/>
                Game
            </Text>
        </Flex>
    );
}

export default Banner;