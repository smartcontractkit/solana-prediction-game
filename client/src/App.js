import Header from './components/Header/Header';
import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import ActivePredictions from './components/ActivePredictions';
import { useMoralis } from 'react-moralis';
import BetSidebar from './components/BetSidebar';

function App() {
  const { isInitialized, isAuthenticated } = useMoralis();

  return (
    <>
      <Header />
      <DataFeedTable />
      {
        isInitialized && (
          <>
            <ActivePredictions />
            {
              isAuthenticated && (
                <>
                  <BetSidebar />
                </>
              ) 
            }
          </>
        )
      }
    </>
  );
}

export default App;