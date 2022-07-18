import React, { useState } from "react";

import { createContext } from "react"; 

const BetDataProvider = (props) => {
    const [betSlip, setBetSlip] = useState(null);

    return(
        <BetDataContext.Provider value={{ betSlip, setBetSlip }}>
            { props.children }
        </BetDataContext.Provider>
    )
};

export const BetDataContext = createContext({
    betSlip: null,
    setBetSlip: (betSlip) => {}
}); 

export default BetDataProvider;