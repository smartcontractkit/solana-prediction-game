import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";

import { createContext } from "react"; 

const UserDataProvider = (props) => {
    const { connected } = useWallet();
    const [betSlip, setBetSlip] = useState(null);

    if(!connected) return (props.children);
    
    return (
        <UserDataContext.Provider value={{ 
            betSlip, 
            setBetSlip
        }}>
            { props.children }
        </UserDataContext.Provider>
    )
};

export const UserDataContext = createContext({
    betSlip: null,
    setBetSlip: (betSlip) => {}
}); 

export default UserDataProvider;