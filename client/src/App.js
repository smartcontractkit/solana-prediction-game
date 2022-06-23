import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import Header from './components/Header/Header';
import { useSolanaAddressDataFeed } from './hooks/useSolanaAddressDataFeed';
// import { useAddressDataFeed } from './hooks/useAddressDataFeed';

function App() {
  const solanaDataFeed = useSolanaAddressDataFeed();
  // const solanaDataFeed = useAddressDataFeed();

  return (
    <>
      <Header />
      <DataFeedTable dataFeeds={solanaDataFeed}/>
    </>
  );
}

export default App;
