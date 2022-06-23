import DataFeedTable from './components/DataFeedTable/DataFeedTable';
import Header from './components/Header/Header';
import { useSolanaDataFeed } from './hooks/useSolanaDataFeed';

function App() {
  const solanaDataFeed = useSolanaDataFeed();
  console.log(solanaDataFeed);

  return (
    <>
      <Header />
      <DataFeedTable dataFeeds={solanaDataFeed}/>
    </>
  );
}

export default App;
