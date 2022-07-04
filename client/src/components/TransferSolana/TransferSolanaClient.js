import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

export const SendFromClientAddress = () => {
    const  { user } = useMoralis();
    const  [ provider, setProvider ] = useState(null);

    useEffect( ()=>{
        if ("solana" in window) {
            const solWindow = window;
            console.log(solWindow?.solana)
            if (solWindow?.solana?.isPhantom) {
                setProvider(solWindow?.solana);
                // Attemp an eager connection
                solWindow.solana.connect({ onlyIfTrusted: true });
            }
        }
    }, []);


    const onClick = useCallback(async () => {

        if (!provider) {
            window.open("https://www.phantom.app/", "_blank");
        }

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const publicKey = new PublicKey(user.get("solAddress"));

        const secret = Uint8Array.from([85,105,9,5,143,6,151,16,145,226,251,129,35,195,180,119,115,128,163,138,123,125,47,105,176,149,182,84,203,162,169,223,97,231,10,129,35,97,6,149,220,235,224,147,178,234,48,238,172,81,76,170,95,237,199,20,64,30,116,47,24,97,77,72])
        const escrowKeyPair = Keypair.fromSecretKey(secret);

        const latestBlockHash = await connection.getLatestBlockhash();

        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
        })

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: escrowKeyPair.publicKey,
                lamports: LAMPORTS_PER_SOL * 0.5,
            })
        );

        const signed = await provider.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(transaction.serialize());
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });
        console.log(signed);

    }, [user, provider]);

    return provider && (
        <button onClick={onClick} >
            Send 0.5 SOL from client
        </button>
    );
};
