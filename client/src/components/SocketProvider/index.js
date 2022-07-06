import React, { useState, useEffect } from "react";
import SocketContext from "./context";
import { initSockets } from "../../sockets";

const SocketProvider = (props) => {
    const [value, setValue] = useState({
        dataFeeds: []
    });

    // eslint-disable-next-line
    useEffect(() => initSockets({ setValue }), [initSockets]);

    return(
        <SocketContext.Provider value={ value }>
        { props.children }
        </SocketContext.Provider>
    )
};

export default SocketProvider;