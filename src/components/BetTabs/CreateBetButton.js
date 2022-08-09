import { Button } from "@chakra-ui/react";
import { useCallback, useContext, useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { UserDataContext } from "../../contexts/UserDataProvider";

export default function CreateBetButton( 
    { 
        predictionId,
        amount,
        setBetSlip,
        betPlaced,
        setBetPlaced,
        ...props
    }
    ) {
    const [isSaving, setIsSaving] = useState(false);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { user } = useContext(UserDataContext);

    const sendSolana = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        const escrowPubKey = Keypair.generate("7bAt59dk7gSgxTG4pqMFKGuPcvV541NT9k1MnkbahFsm").publicKey;

        const latestBlockHash = await connection.getLatestBlockhash();

        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
        });

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: escrowPubKey,
                lamports: amount * LAMPORTS_PER_SOL
            })
        );

        const signature = await sendTransaction(transaction, connection).catch(err => {
            console.error(err);
            setIsSaving(false);
        })

        console.log("Transaction:", signature);

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        return signature;

    }, [amount, connection, publicKey, sendTransaction]);

    const createBet = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        const transactionSignature = await sendSolana();
        const data = {
            user: user._id,
            prediction: predictionId,
            amount,
            status: 'ongoing',
            transactionSignature,
        }

        axiosInstance.post('/api/bets/add', data)
        .then(res => res.data)
        .then(data => {
            setIsSaving(false);
            setBetSlip(null);
            setBetPlaced(!betPlaced);
            console.log("Bet created");
        })
        .catch(err => {
            setIsSaving(false);
            setBetSlip(null);
            console.log("Error occured: " + err.message);
        });  
    }


    return (
        <Button
            isLoading={isSaving}
            loadingText="Betting..."
            onClick={createBet}
            {...props}
        >
            Make Bet
        </Button>
    );
}