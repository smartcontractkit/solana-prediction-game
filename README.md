<div align="center">
  
# `Blockchain Prediction Game`

This Project utilizes [`chainlink`](https://chain.link/) to demostrates how to build a simple Prediction Game using Solana. This project works on both Solana Mainnet Beta, Testnet & Devnet. This is based of the the boilerplate [`solana-defi-dashboard`](https://github.com/YosephKS/solana-defi-dashboard)
  
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

✏ Copy `.env.example` into to `.env` in the main folder and provide Biconomy API Keys:
✏ Run `solana-keygen new --outfile ./id.json` to create a temporary Solana wallet to use for this example.
✏ Run `export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com && export ANCHOR_WALLET=./id.json` to set the Anchor environment variables.


```jsx
GENERATE_SOURCEMAP=false

REACT_APP_MORALIS_APPLICATION_ID = xxx;
REACT_APP_MORALIS_SERVER_URL = xxx;
```

🚴‍♂️ Run your App:

```sh
vercel dev
```

