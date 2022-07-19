import React from "react";
import ReactDOM from 'react-dom/client';
import { MoralisProvider } from "react-moralis";
import "./styles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import SocketProvider from "./contexts/SocketProvider";
import theme from './theme';
import UserDataProvider from "./contexts/UserDataProvider";
import SolanaWalletProvider from "./contexts/SolanaWalletProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <MoralisProvider
      initializeOnMount
      appId={process.env.REACT_APP_MORALIS_APP_ID}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
    >
      <ChakraProvider theme={theme}>
        <SolanaWalletProvider>
          <SocketProvider>
            <UserDataProvider>
              <App/>
            </UserDataProvider>
          </SocketProvider>
        </SolanaWalletProvider>
      </ChakraProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
