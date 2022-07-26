import React from "react"
import { Heading, HStack, Image } from "@chakra-ui/react"
import logo from "../../assets/logos/logo.svg";

export default function Logo(props) {
  return (
    <HStack
      h="38px"
      p={0}
    >
      <Image
          boxSize='38px'
          src={logo}
          alt="Logo"
      />
      <Heading 
        fontSize="14px"
        lineHeight="1.2"
        letterSpacing="-0.03em" 
        fontWeight="600"
      >
        Prediction <br/>
        Game
      </Heading>
    </HStack>
  )
}
