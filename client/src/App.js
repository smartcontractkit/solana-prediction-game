import Header from './components/Header';
import ActivePredictions from './components/ActivePredictions';
import { useMoralis } from 'react-moralis';
import BetTabs from './components/BetTabs';
import { Flex, VStack } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import Subheader from './components/Subheader';
import Hero from './components/Hero';

function App() {
  const { isInitialized } = useMoralis();
  const { connected } = useWallet();

  return (
    <VStack 
      py={8}
      px={4}
      gap={4}
      >
      <Header />
      <Hero />
      {
        isInitialized && (
          <Flex
            gap={[8, 8, 2, 2]}
            direction={['column-reverse', 'column-reverse' , 'row', 'row']}
          >
            <VStack
              width={['100%', '100%' , '59%', '75%']}
              gap={4}
            >
              <Subheader />
              <ActivePredictions />
            </VStack>
            {
              connected && (
                <VStack
                  width={['100%', '100%', '38%', '25%']}
                  flexGrow={[1, 1, 1, 0]}
                  gap={2}
                >
                  <BetTabs />
                </VStack>
              ) 
            }
          </Flex>
        )
      }
    </VStack>
  );
}

export default App;