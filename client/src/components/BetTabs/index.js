import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react';
import BetSlip from './BetSlip';
import MyBets from './MyBets';

const BetSidebar = () => {
    return (
        <Box
            borderRadius="20px"
            bg="gray.800"
            pt="16px"
            w="100%"
            minWidth="250px"
            h="max-content"
            alignItems="center"
            direction="column" 
        >
            <Tabs variant='soft-rounded' colorScheme='blue' align="center">
                <TabList>
                    <Tab>Betslip</Tab>
                    <Tab>My Bets</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <BetSlip />
                    </TabPanel>
                    <TabPanel>
                        <MyBets/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box> 
    )
}

export default BetSidebar;