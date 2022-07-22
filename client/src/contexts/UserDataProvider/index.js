import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { createContext } from "react"; 
import axiosInstance from "../../helpers/axiosInstance";

const UserDataProvider = (props) => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const [betSlip, setBetSlip] = useState(null);
    const [balance, setBalance] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
      async function getBalance() {
        return await connection.getBalance(publicKey)
      }

      const getUser = async () => {
        const query = {
          address: publicKey.toBase58(),
        }
        axiosInstance.get(`/getUser`, query)
        .then(res => res.data)
        .then(user => {
          setUser(user);
        })
        .catch(err => {
          console.log("Error occured: " + err.message);
        });
      }

      if (connected) {
        getBalance()
        .then(res => {
          setBalance(res/LAMPORTS_PER_SOL);
        })
        .catch(err => {
          console.log(err);
        });
        getUser();
      }
    }, [connected, connection, publicKey]);


    if(!connected) return (props.children);
    
    return (
        <UserDataContext.Provider value={{
          balance,
          address: publicKey.toBase58(),
          user,
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
  user: null,
  setBetSlip: (betSlip) => {}
}); 

export default UserDataProvider;