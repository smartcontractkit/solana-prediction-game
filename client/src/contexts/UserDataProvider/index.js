import React, { useEffect } from "react";

import { createContext } from "react"; 
import { useMoralis, useMoralisSolanaApi, useMoralisSolanaCall } from "react-moralis";

const UserDataProvider = (props) => {
    const network = "devnet"
    const {
      isAuthenticated,
      user
    } = useMoralis();
    const { account } = useMoralisSolanaApi();
    const { fetch, data } = useMoralisSolanaCall(account.getPortfolio);
  
    useEffect(() => {
      if (isAuthenticated && user.get("solAddress")) {
        fetch({
          params: {
            address: user.get("solAddress"),
            network,
          },
        });
      }
    }, [fetch, isAuthenticated, user, network]);

    if (isAuthenticated && user.get("solAddress")) {
        return(
            <UserDataContext.Provider value={{ 
                balances: data,
                address: user.get("solAddress")
            }}>
                { props.children }
            </UserDataContext.Provider>
        )
    }else {
      return (props.children)
    }
};

export const UserDataContext = createContext({
    balances: null,
    address: null
}); 

export default UserDataProvider;