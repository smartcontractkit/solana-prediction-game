import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { useCallback } from 'react';
import { useMoralis } from 'react-moralis';

export const SendOneLamportFromEscrowAddress = () => {
    const  { user } = useMoralis();

    const onClick = useCallback(async () => {
        const connection = new Connection(clusterApiUrl('devnet'));
        const publicKey = new PublicKey(user.get("solAddress"));


        const secret = Uint8Array.from([85,105,9,5,143,6,151,16,145,226,251,129,35,195,180,119,115,128,163,138,123,125,47,105,176,149,182,84,203,162,169,223,97,231,10,129,35,97,6,149,220,235,224,147,178,234,48,238,172,81,76,170,95,237,199,20,64,30,116,47,24,97,77,72])
        let escrowKeyPair = Keypair.fromSecretKey(secret);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: escrowKeyPair.publicKey,
                lamports: 1,
            })
        );

        sendAndConfirmTransaction(
            connection,
            transaction,
            [escrowKeyPair]
          );
    }, [user]);

    return (
        <button onClick={onClick}>
            Send 1 SOL
        </button>
    );
};