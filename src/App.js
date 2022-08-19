import Header from './components/Header';
import ActivePredictions from './components/ActivePredictions';
import BetTabs from './components/BetTabs';
import { Flex, VStack } from '@chakra-ui/react';
import Subheader from './components/Subheader';
import Hero from './components/Hero';
import BetWonNotifications from './components/BetWonNotifications';
import Leaderboard from './components/Leaderboard';

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
          gap={[8, 8, 8, "1.5rem", "1.5rem"]}
          direction={['column-reverse', 'column-reverse' , 'column-reverse', 'row', 'row']}
          w="100%"
        >
          <VStack
            width={['100%', '100%', '100%', '59%', '75%']}
            gap={4}
          >
            <Subheader />
            <ActivePredictions />
          </VStack>
          <VStack
            width={['100%', '100%', '100%', '38%', '25%']}
            flexGrow={[1, 1, 1, 0]}
            gap={4}
          >
            <BetWonNotifications />
            <BetTabs />
            <Leaderboard />
          </VStack>
        </Flex>
      }
    </VStack>
  );
}

export default App;