import { useEffect, useState } from 'react';
import Header from './components/Header/Header';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/solana-feed")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.message)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Header />
      {data && <p>{data}</p>}
    </>
  );
}

export default App;
