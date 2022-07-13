import Header from './components/Header/Header';
import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import ActivePredictions from './components/ActivePredictions';
import { useMoralis } from 'react-moralis';
import BetSidebar from './components/BetSidebar';
import { Grid, GridItem, VStack } from '@chakra-ui/react';

function App() {
  const { isInitialized, isAuthenticated } = useMoralis();

  return (
    // <VStack p={8}>
    //   <Header />
    //   <DataFeedTable />
    //   {
    //     isInitialized && (
    //       <Grid>
    //         <ActivePredictions />
    //         {
    //           isAuthenticated && (
    //             <>
    //               <BetSidebar />
    //             </>
    //           ) 
    //         }
    //       </Grid>
    //     )
    //   }
    // </VStack>
    <Grid
      templateAreas={[
        `
          "header"
          "hero"
          "sidebar"
          "main"
        `,
        `
          "header header"
          "hero hero"
          "main sidebar"
        `,
        `
          "header header"
          "hero hero"
          "main sidebar"
        `,
        `
          "header header"
          "hero hero"
          "main sidebar"
        `
      ]}
      gridTemplateRows={['auto', 'auto', 'auto', 'auto', 'auto']}
      gridTemplateColumns={['1fr', '2fr 2fr', '3fr 1fr', '3fr 1fr']}
      gap={4}
      px={4}
      py={8}
    >
      <GridItem area={'header'}>
        <Header />
      </GridItem>
      <GridItem area={'hero'}>
        <DataFeedTable />
      </GridItem>
      {
        isInitialized && (
          <>
            <GridItem area={'main'}>
              <VStack>
                {/* Prediciton Deadline */}
                <ActivePredictions />
              </VStack>
            </GridItem>
            <GridItem area={'sidebar'}>
              {
                isAuthenticated && (
                  <VStack>
                    {/* Bet Win Alert */}
                    <BetSidebar />
                    {/* LeaderBoard */}
                  </VStack>
                )
              }
            </GridItem>
          </>
        )
      }
    </Grid>
  );
}

export default App;