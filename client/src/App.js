import Header from './components/Header/Header';
import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import ActivePredictions from './components/ActivePredictions';
import { useMoralis } from 'react-moralis';
import BetSidebar from './components/BetSidebar';
import { Flex, Grid, GridItem, VStack } from '@chakra-ui/react';

function App() {
  const { isInitialized, isAuthenticated } = useMoralis();

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
              isAuthenticated && (
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
    // <Grid
    //   templateAreas={[
    //     `
    //       "header"
    //       "hero"
    //       "sidebar"
    //       "main"
    //     `,
    //     `
    //       "header"
    //       "hero"
    //       "sidebar"
    //       "main"
    //     `,
    //     `
    //       "header header"
    //       "hero hero"
    //       "main sidebar"
    //     `,
    //     `
    //       "header header"
    //       "hero hero"
    //       "main sidebar"
    //     `
    //   ]}
    //   gridTemplateRows={['auto', 'auto', 'auto', 'auto', 'auto']}
    //   gridTemplateColumns={['1fr', '1fr', '3fr 1fr', '3fr 1fr']}
    //   gap={4}
    //   px={4}
    //   py={8}
    // >
    //   <GridItem area={'header'}>
    //     <Header />
    //   </GridItem>
    //   <GridItem area={'hero'}>
    //     <DataFeedTable />
    //   </GridItem>
    //   {
    //     isInitialized && (
    //       <>
    //         <GridItem area={'main'}>
    //           <VStack>
    //             {/* Prediciton Deadline */}
    //             <ActivePredictions />
    //           </VStack>
    //         </GridItem>
    //         <GridItem area={'sidebar'}>
    //           {
    //             isAuthenticated && (
    //               <VStack>
    //                 {/* Bet Win Alert */}
    //                 <BetSidebar />
    //                 {/* LeaderBoard */}
    //               </VStack>
    //             )
    //           }
    //         </GridItem>
    //       </>
    //     )
    //   }
    // </Grid>
  );
}

export default App;