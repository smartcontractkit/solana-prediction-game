import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure, useToast } from "@chakra-ui/react";
import { useCallback, useContext, useRef, useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { UserDataContext } from "../../contexts/UserDataProvider";

export default function CreateBetButton( 
    { 
        predictionId,
        amount,
        setBetslip,
        betPlaced,
        setBetPlaced,
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

    const network = WalletAdapterNetwork.Devnet;

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
            setBetslip(null);
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
        .catch(err => {
            setIsSaving(false);
            setBetslip(null);
            toast({
                title: 'Error creating bet.',
                description: err.message,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        });  
    }

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
                            Are you sure you want to make this bet?
                        </AlertDialogBody>
            
                        <AlertDialogFooter>
                            <Button colorScheme='red' ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                color="gray.800"
                                bg="blue.200"
                                _hover={{
                                    bg: "blue.100",
                                }} 
                                onClick={createBet} 
                                isLoading={isSaving}
                                loadingText="Placing bet..."
                                ml={3}
                            >
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}