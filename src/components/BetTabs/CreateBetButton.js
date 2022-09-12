import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure, useToast } from "@chakra-ui/react";
import { useCallback, useContext, useRef, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { UserDataContext } from "../../contexts/UserDataProvider";
import { formatDate } from "../../lib/helpers";

export default function CreateBetButton( 
    { 
        predictionId,
        amount,
        setBetslip,
        betPlaced,
        setBetPlaced,
        firstCurrency,
        direction,
        expiryTime,
        predictionPrice,
        ...props
    }
    ) {
    const [isSaving, setIsSaving] = useState(false);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { user } = useContext(UserDataContext);
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const toast = useToast();

    const network = process.env.REACT_APP_SOLANA_CLUSTER_NETWORK;

    const sendSolana = useCallback(async () => {
        // if user is not connected to wallet, show error
        if (!publicKey) {
            toast({
                title: 'Wallet not connected.',
                description: "Ensure you're connected to solana wallet.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            throw new WalletNotConnectedError();
        }
        
        // get public key from escrow account address
        const escrowPubKey = Keypair.generate(process.env.REACT_APP_WALLET_PUB_ADDRESS).publicKey;

        // get latest block hash from cluster
        const latestBlockHash = await connection.getLatestBlockhash();

        // create transaction to show latest block hash and user address is paying for transaction on solana
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
        });

        // add program to transaction
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: escrowPubKey,
                lamports: amount * LAMPORTS_PER_SOL
            })
        );

        // send transaction and return tx signature
        const signature = await sendTransaction(transaction, connection, {
            maxRetries: 5
        })
        .catch(err => {
            toast({
                title: 'Transaction error:',
                description: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        })

        // confirm transaction was sent
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        return signature;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, connection, publicKey, sendTransaction]);

    const createBet = async () => {
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
            // set bet slip to null
            setBetslip(null);
            // trigger my bets to be reloaded
            setBetPlaced(!betPlaced);

            const transactionUrl = `https://explorer.solana.com/tx/${transactionSignature}?cluster=${network}`;
            toast({
                title: 'Bet created.',
                description: "View on explorer: " + transactionUrl,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        })
        // retry in case itt fails 
        .catch(err => {
            setIsSaving(false);
            setBetslip(null);
            toast({
                title: 'Error creating bet.',
                description: err.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        });  
    }

    // show dialog to confirm bet creation
    const showDialog = (event) => {
        event.preventDefault();
        onOpen();
    }


    return (
        <>
            <Button
                size="sm"
                onClick={showDialog}
                isLoading={isSaving}
                loadingText="Placing bet..."
                {...props}
            >
                Place Bet
            </Button>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="gray.800">
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Place Bet
                        </AlertDialogHeader>
            
                        <AlertDialogBody>
                            You are betting {amount} SOL that {firstCurrency} will settle { direction ? 'above' : 'below' } {predictionPrice} {formatDate(expiryTime)}
                        </AlertDialogBody>
            
                        <AlertDialogFooter>
                            <Button colorScheme='red' ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                color="gray.800"
                                bg="green.200"
                                onClick={createBet} 
                                isLoading={isSaving}
                                loadingText="Placing bet..."
                                ml={3}
                            >
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}