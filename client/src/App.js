import Header from './components/Header';
import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import ActivePredictions from './components/ActivePredictions';
import { useMoralis } from 'react-moralis';
import BetSidebar from './components/BetSidebar';
import { Flex, VStack } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';

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
      <DataFeedTable />
      {
        isInitialized && (
          <Flex
            gap={2}
            direction={['column-reverse', 'column-reverse' , 'row', 'row']}
          >
            <VStack
              width={['100%', '100%' , '59%', '75%']}
            >
              <ActivePredictions />
            </VStack>
            {
              connected && (
                <VStack
                  width={['100%', '100%', '38%', '25%']}
                >
                  <BetSidebar />
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