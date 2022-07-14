import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, VStack, Text, Image } from '@chakra-ui/react';
import emptyBets from '../../assets/bets/empty-bets.svg'
import emptyBetSlip from '../../assets/bets/empty-betslip.svg'

const BetSidebar = () => {
    return (
        <Box
            borderRadius="20px"
            bg="gray.800"
            p="16px"
            w="100%"
            minWidth="250px"
            h="max-content"
            gap="32px"
            alignItems="flex-start"
            direction="column" 
        >
            <Tabs variant='soft-rounded' colorScheme='blue' align="center">
                <TabList>
                    <Tab>Betslip</Tab>
                    <Tab>My Bets</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack>
                            <Image src={emptyBetSlip} height="64px" alt="empty bet slip" my="10px" />
                            <Text fontWeight={700} color="gray.200">
                                Betslip is empty
                            </Text>
                            <Text color="gray.500">
                                To add a bet to your betslip, please select a prediction from the list.
                            </Text>
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack>
                            <Image src={emptyBets} height="64px" alt="empty bet slip" my="10px" />
                            <Text fontWeight={700} color="gray.200">
                                No bets here yet
                            </Text>
                            <Text color="gray.500">
                                Make your first one and it will appear here.
                            </Text>
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box> 
    )
}

export default BetSidebar;