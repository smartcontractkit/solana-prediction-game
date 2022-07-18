import React, { useState } from "react";

import { createContext } from "react"; 

const UserDataProvider = (props) => {
    const [userData, setUserData] = useState({
        userData: null
    });

    return(
        <UserDataContext.Provider value={{ userData, setUserData }}>
            { props.children }
        </UserDataContext.Provider>
    )
};

export const UserDataContext = createContext({
    userData: null,
    setUserData: (userData) => {}
}); 

export default UserDataProvider;