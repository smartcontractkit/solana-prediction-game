import { Flex, HStack, Image, Link, Text, Tooltip } from "@chakra-ui/react";
import { capitalize } from "../../lib/helpers";

const GetStartedList = ({description, name, logos}) => {

  return (
    <Flex w={'full'} alignItems={'center'} gap={2}>
      <Text color="gray.300">{description}</Text>
      {
        logos && logos.length && (
            <HStack
                w="auto"
                bg="whiteAlpha.50"
                p="4px 12px"
                alignItems="center"
                borderRadius="6px"
                justifyContent="space-between"
            >
                <HStack>
                    {
                        logos.map((logo, i) => {
                            const imageSrc = require(`../../assets/logos/${logo.name}${logo.extension}`);
                            return (
                                <Link
                                    key={i}
                                    href={logo.link} 
                                    isExternal
                                >
                                    <Tooltip 
                                        label={capitalize(logo.name)}
                                    >
                                        <Image
                                            borderRadius='full'
                                            boxSize='20px'
                                            src={imageSrc}
                                            alt={`${logo.name} logo`}
                                        />
                                    </Tooltip>
                                </Link>
                            )
                        })
                    }
                </HStack>
            </HStack>

        )
      }
    </Flex>
  );
}

export default GetStartedList;