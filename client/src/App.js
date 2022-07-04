import Header from './components/Header/Header';
import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import ActivePredictions from './components/ActivePredictions/ActivePredictions';
import { useMoralis } from 'react-moralis';
import { Wallet } from './components/Wallet/Wallet';
// import { SendOneLamportToRandomAddress } from './components/TransferSOL/TransferSOL';
import { SendOneLamportFromEscrowAddress } from './components/TransferSolana/TransferSolana';

function App() {
  const { isInitialized } = useMoralis();

  return (
    <Wallet>
      <Header />
      <DataFeedTable />
      {
        isInitialized && <ActivePredictions />
      }
      {/* <SendOneLamportToRandomAddress /> */}
      <SendOneLamportFromEscrowAddress />
    </Wallet>
  );
}

export default App;