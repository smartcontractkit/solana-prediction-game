import Header from './components/Header/Header';
import useChainlinkFeed from './hooks/useChainlinkFeed';

function App() {
  const data = useChainlinkFeed();
  return (
    <>
      <Header />

      {data}
    </>
  );
}

export default App;
