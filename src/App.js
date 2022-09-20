import AllPredictions from './components/AllPredictions';
import BetTabs from './components/BetTabs';
import { Flex, VStack } from '@chakra-ui/react';
import Subheader from './components/Subheader';
import Banner from './components/Banner';
import BetWonNotifications from './components/BetWonNotifications';
import Leaderboard from './components/Leaderboard';
import WalletButton from './components/WalletButton';
import useGoogleTagManager from './hooks/useGoogleTagManager';

function App() {
  useGoogleTagManager(process.env.REACT_APP_PUBLIC_GOOGLE_ANALYTICS_TRACKING);

  return (
    <VStack>
      <Banner />
      <VStack 
        py={8}
        px={4}
        gap={8}
        maxWidth='1300px'
        >
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
              <AllPredictions />
            </VStack>
            <VStack
              width={['100%', '100%', '100%', '38%', '25%']}
              flexGrow={[1, 1, 1, 0]}
              gap={4}
            >
              <WalletButton w="100%" />
              <BetWonNotifications />
              <BetTabs />
              <Leaderboard />
            </VStack>
          </Flex>
        }
      </VStack>
    </VStack>
  );
}

export default App;