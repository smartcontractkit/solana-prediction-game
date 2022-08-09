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
    const [betPlaced, setBetPlaced] = useState(false);

    
    const getBalance = async () => {
      return await connection.getBalance(publicKey)
    }

    const addUser = async () => {
      const newUser = {
        address: publicKey.toBase58(),
      }

      return await axiosInstance.post("/api/users/add", newUser);
    }

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

    const getMyBets = async (user) => {
      if(!user) return;
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
      if (connected) {
        getUser(publicKey.toBase58());
      } else{
        setUser(null);
        setBalance(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey]);

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

        window.getMyBetsInterval = setInterval(
          () => getMyBets(user),
          120000
        )
        return () => {
            clearInterval(window.getMyBetsInterval)
        }

      } else{
        setBalance(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey, user, betPlaced]);

    let value = {
      balance : null,
      adress: null,
      user : null,
      myBets : null,
      betSlip, 
      setBetSlip,
      betPlaced,
      setBetPlaced
    };

    if(connected) {
      value = {
        balance,
        address: publicKey.toBase58(),
        user,
        myBets,
        betSlip, 
        setBetSlip,
        betPlaced,
        setBetPlaced
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
  betPlaced: false,
  setBetPlaced: (betPlaced) => {},
}); 

export default UserDataProvider;