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
      const getBalance = async () => {
        return await connection.getBalance(publicKey)
      }

      const addUser = async () => {
        const newUser = {
          address: publicKey.toBase58(),
        }

        return await axiosInstance.post("/users/add", newUser);
      }

      const getUser = async (address) => {
        const query = {
          address,
        }
        axiosInstance.get(`/users/`, query)
        .then(res => res.data)
        .then(async (result) => {
          let loggedInUser = null;
          
          if(!result){
            loggedInUser = await addUser();
          }else{
            loggedInUser = result;
          }

          setUser(loggedInUser);
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
        getUser(publicKey.toBase58());
      } else{
        setBalance(null);
        setUser(null);
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