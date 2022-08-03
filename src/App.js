import Header from './components/Header';
import ActivePredictions from './components/ActivePredictions';
import BetTabs from './components/BetTabs';
import { Flex, VStack } from '@chakra-ui/react';
import Subheader from './components/Subheader';
import Hero from './components/Hero';
import BetWonNotifications from './components/BetWonNotifications';

function App() {

  return (
    <VStack 
      py={8}
      px={4}
      gap={8}
      >
      <Header />
      <Hero />
      {
        <Flex
          gap={[8, 8, 2, 2]}
          direction={['column-reverse', 'column-reverse' , 'row', 'row']}
          w="100%"
        >
          <VStack
            width={['100%', '100%' , '59%', '75%']}
            gap={4}
          >
            <Subheader />
            <ActivePredictions />
          </VStack>
          <VStack
            width={['100%', '100%', '38%', '25%']}
            flexGrow={[1, 1, 1, 0]}
            gap={2}
          >
            <BetWonNotifications />
            <BetTabs />
          </VStack>
        </Flex>
      }
    </VStack>
  );
}

export default App;