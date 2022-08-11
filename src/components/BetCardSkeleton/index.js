import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const CardSKeleton = () => (
    <Box 
        padding='6' 
        boxShadow='lg' 
        bg='gray.800'
        borderRadius="20px"
        gap="32px"
        minWidth="250px"
        maxWidth={["100%", "100%", "100%", "300px"]}
        alignItems="flex-start"
        direction="column"   
        flexGrow={1}
    >

        <SkeletonText mt='4' noOfLines={4} spacing='4' opacity={0.3} />
        <SkeletonCircle mt='4' boxSize='24px' opacity={0.3} />
        <Skeleton mt='4' height='32px' rounded="md" opacity={0.3} />
    </Box>
)

export default CardSKeleton;