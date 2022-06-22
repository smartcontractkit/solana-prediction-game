import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import io from 'socket.io-client';

const socket = io("http://localhost:3001");


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.emit('get_solana_data_feed', 'Get Solana Data Feed');
    socket.on('receive_solana_data_feed', (data) => {
      console.log(data);
      if(data) {
        setData(data);
      }
    });
  }, []);

  return (
    <>
      <Header />
      {/* {data && <p>{data}</p>} */}
    </>
  );
}

export default App;
