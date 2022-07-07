import React, { useState, useEffect } from "react";
import { initSockets } from "../../sockets";

import { createContext } from "react"; 

const SocketProvider = (props) => {
    const [value, setValue] = useState({
        dataFeeds: []
    });

    useEffect(() => initSockets({ setValue }), [initSockets]);

    return(
        <SocketContext.Provider value={ value }>
            { props.children }
        </SocketContext.Provider>
    )
};

export const SocketContext = createContext({  
    dataFeeds: []
}); 

export default SocketProvider;