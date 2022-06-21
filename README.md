<div align="center">
  
# `Blockchain Prediction Game`

This Project utilizes [`moralis`](https://github.com/MoralisWeb3/Moralis-JS-SDK) and [`chainlink`](https://chain.link/) to demostrates how to build a simple Prediction Game using Solana. This project works on both Solana Mainnet Beta, Testnet & Devnet. This is based of the the boilerplate [`solana-defi-dashboard`](https://github.com/YosephKS/solana-defi-dashboard)
  
</div>

# 🚀 Quick Start

📄 Clone or fork `blockchain-prediction-game`:

```sh
git clone https://github.com/thisdot/blockchain-prediction-game.git
```

💿 Install all dependencies:

```sh
cd blockchain-prediction-game
yarn install
```

✏ Rename `.env.example` to `.env` in the main folder and provide your `appId` and `serverUrl` from Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server)), plus some other Biconomy API Keys:

```jsx
GENERATE_SOURCEMAP=false

REACT_APP_MORALIS_APPLICATION_ID = xxx;
REACT_APP_MORALIS_SERVER_URL = xxx;
```

🚴‍♂️ Run your App:

```sh
yarn start
```
