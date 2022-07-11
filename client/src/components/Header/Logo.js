import React from "react"
import { Box, Heading } from "@chakra-ui/react"

export default function Logo(props) {
  return (
    <Box 
      w="90px"
      h="40px"
      padding="8px"
      flex="0 0 auto"
      gap={8}
      borderRadius="12px"background="radial-gradient(61.46% 72.27% at 27.22% 31.25%, rgba(49, 255, 168, 0.5) 0%, rgba(38, 100, 205, 0.5) 100%)"
      {...props} 
    >
      <Heading 
        fontSize="14px"
        lineHeight="12px" 
        fontWeight="600"
      >
        Prediction Game
      </Heading>
    </Box>
  )
}