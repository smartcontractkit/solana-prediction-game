import React, { useState } from "react";

import { createContext } from "react"; 

const BetDataProvider = (props) => {
    const [value, setValue] = useState({
        betSlip: null
    });

    const setBetSlip = (betSlip) => {
        setValue({...value, betSlip})
    }

    return(
        <BetDataContext.Provider value={{ ...value, setBetSlip }}>
            { props.children }
        </BetDataContext.Provider>
    )
};

export const BetDataContext = createContext({  
    betSlip: null
}); 

export default BetDataProvider;