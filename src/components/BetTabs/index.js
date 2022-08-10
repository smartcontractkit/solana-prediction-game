import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react';
import Betslip from './Betslip';
import MyBets from './MyBets';

const BetTabs = () => {
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
            id="bet-tabs"
        >
            <Tabs variant='soft-rounded' colorScheme='blue' align="center">
                <TabList>
                    <Tab>Betslip</Tab>
                    <Tab>My Bets</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Betslip />
                    </TabPanel>
                    <TabPanel>
                        <MyBets/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box> 
    )
}

export default BetTabs;