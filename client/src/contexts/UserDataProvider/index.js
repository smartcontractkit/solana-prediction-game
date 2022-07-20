import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { createContext } from "react"; 

const UserDataProvider = (props) => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const [betSlip, setBetSlip] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
      async function getBalance() {
        return await connection.getBalance(publicKey)
      }

      if (connected) {
        getBalance()
        .then(res => {
          setBalance(res/LAMPORTS_PER_SOL);
        })
        .catch(err => {
          console.log(err);
        });
      }
    }, [connected, connection, publicKey]);


    if(!connected) return (props.children);
    
    return (
        <UserDataContext.Provider value={{
          balance: balance,
          address: publicKey.toBase58(),
          betSlip, 
          setBetSlip
        }}>
            { props.children }
        </UserDataContext.Provider>
    )
};

export const UserDataContext = createContext({
  balance: null,
  address: null,
  betSlip: null,
  setBetSlip: (betSlip) => {}
}); 

export default UserDataProvider;