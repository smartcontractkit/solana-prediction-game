import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { createContext } from "react"; 
import axiosInstance from "../../lib/axiosInstance";
import { useToast } from "@chakra-ui/react";

const UserDataProvider = (props) => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();

    const [betSlip, setBetslip] = useState(null);
    const [balance, setBalance] = useState(null);
    const [user, setUser] = useState(null);
    const [myBets, setMyBets] = useState(null);
    const [betPlaced, setBetPlaced] = useState(false);

    const toast = useToast();

    // Get user balance from solana network based on public key
    const getBalance = async () => {
      return await connection.getBalance(publicKey)
    }

    // Add User to database
    const addUser = async () => {
      const newUser = {
        address: publicKey.toBase58(),
      }

      return await axiosInstance.post("/api/users/add", newUser);
    }

    // Get user from database
    const getUser = async (address) => {
      axiosInstance.get(`/api/users/getUser`, {
        params: {
          address
        }
      })
      .then(res => res.data)
      .then(async (result) => {
        let loggedInUser = null;
        
        // If user is not in database, add user to database
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
        toast({
            title: 'Error getting user details',
            description: err.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
      });
    }

    // Get user bets from database
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
        toast({
            title: 'Error getting your previous bets',
            description: err.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
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
          toast({
              title: 'Balance Updated',
              description: "Your balance has been updated",
              status: 'info',
              duration: 9000,
              isClosable: true,
          })
        })
        .catch(err => {
          toast({
              title: 'Error getting your balance',
              description: err.message,
              status: 'error',
              duration: 9000,
              isClosable: true,
          })
        });

        window.getMyBetsInterval = setInterval(
          () => getMyBets(user),
          1000 * 60 * 30 //  1000 ms/s * 60 s/min * 10 min = # ms
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
      setBetslip,
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
        setBetslip,
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
  setBetslip: (betSlip) => {},
  betPlaced: false,
  setBetPlaced: (betPlaced) => {},
}); 

export default UserDataProvider;