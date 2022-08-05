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
    const [myBets, setMyBets] = useState(null);

    
    const getBalance = async () => {
      return await connection.getBalance(publicKey)
    }

    const addUser = async () => {
      const newUser = {
        address: publicKey.toBase58(),
      }

      return await axiosInstance.post("/api/users/add", newUser);
    }

    const getMyBets = async (user) => {
      if(!user) return;
      console.log(user);
      axiosInstance.get(`/api/bets`, {
        params: {
          user: user._id
        }
      })
      .then(res => res.data)
      .then(data => {
        setMyBets(data);
      })
      .catch(err => {
        console.log("Error occured: " + err.message);
      });
    }

    useEffect(() => {

      const getUser = async (address) => {
        axiosInstance.get(`/api/users/getUser`, {
          params: {
            address
          }
        })
        .then(res => res.data)
        .then(async (result) => {
          let loggedInUser = null;
          
          if(!result){
            loggedInUser = await addUser();
          }else{
            loggedInUser = result;
          }

          setUser(loggedInUser);

          getBalance()
          .then(res => {
            setBalance(res/LAMPORTS_PER_SOL);
          })
        })
        .catch(err => {
          console.log("Error occured: " + err.message);
        });
      }

      if (connected) {
        getUser(publicKey.toBase58());
      } else{
        setUser(null);
        setBalance(null);
      }
    }, [publicKey, connected]);

    useEffect(() => {
      if (connected) {
        getMyBets(user);
        getBalance()
        .then(res => {
          setBalance(res/LAMPORTS_PER_SOL);
        })
        .catch(err => {
          console.log(err);
        });
      } else{
        setBalance(null);
      }
    }, [connected, connection]);

    let value = {
      balance : null,
      adress: null,
      user : null,
      myBets : null,
      betSlip, 
      setBetSlip,
    };

    if(connected) {
      value = {
        balance,
        address: publicKey.toBase58(),
        user,
        myBets,
        betSlip, 
        setBetSlip,
      };
    }
    
    return (
      <UserDataContext.Provider value={value}>
          { props.children }
      </UserDataContext.Provider>
    )
};

export const UserDataContext = createContext({
  balance: null,
  address: null,
  user: null,
  myBets: null,
  betSlip: null,
  setBetSlip: (betSlip) => {},
}); 

export default UserDataProvider;