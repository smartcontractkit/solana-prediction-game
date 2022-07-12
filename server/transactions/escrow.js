const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
let keypair;
const programId = new web3.PublicKey("7bAt59dk7gSgxTG4pqMFKGuPcvV541NT9k1MnkbahFsm"); //privKey = 2i3TCLe1yWAWFT6wYVp7igmDEVXRrayEzyD9JsPxQR42hUbnXC8Fj1FpJitv8PEVv4hWcQjJJn1jt46svb8HAb8b
let pdaAccount;
let connection;


const establishConnection = async () =>{
    let rpcUrl = web3.clusterApiUrl('devnet')
    connection = new web3.Connection(rpcUrl, 'confirmed');   
    console.log('Connection to cluster established:', rpcUrl);
}

const connectWallet = async () => {
    let secretKey = Uint8Array.from([85,105,9,5,143,6,151,16,145,226,251,129,35,195,180,119,115,128,163,138,123,125,47,105,176,149,182,84,203,162,169,223,97,231,10,129,35,97,6,149,220,235,224,147,178,234,48,238,172,81,76,170,95,237,199,20,64,30,116,47,24,97,77,72]);
    keypair = web3.Keypair.fromSecretKey(secretKey);
    console.log('keypair created: ' + keypair.publicKey.toString());
}

const createPDAAccount = async () => {
    // pdaAccount = web3.Keypair("2NqsXusbY83aL7W9FKFMvpg5Uq9uk9nufXeckuAYchRk");
    let secretKey = Uint8Array.from([44,103,173,91,23,56,13,22,109,7,88,175,221,86,227,68,135,219,29,171,131,14,52,86,188,124,140,247,34,58,19,216,20,116,36,144,35,248,28,184,254,89,145,55,158,192,11,55,86,159,62,136,76,54,6,29,118,10,197,179,102,101,51,195]);
    pdaAccount = web3.Keypair.fromSecretKey(secretKey);
    const transaction = new web3.Transaction();

    const programAccounts = await connection.getProgramAccounts(programId)

    let existingPDA  = programAccounts.find(account => account.pubkey.toString() === pdaAccount.publicKey.toString());

    if(existingPDA) {
        console.log('Program already exists');
        return
    }

    const instruction = web3.SystemProgram.createAccount({
        fromPubkey: keypair.publicKey,
        newAccountPubkey: pdaAccount.publicKey,
        space: 165,
        lamports: 1000,
        programId,
    });

    transaction.add(instruction);

    var signature = await web3.sendAndConfirmTransaction(
        connection, 
        transaction, 
        [keypair, pdaAccount]
    );
    console.log(signature);
}

const getBalance = async (pubKey) => {
    let balance = await connection.getBalance(pubKey);
    console.log(`${pubKey.toString()} balance: ${balance}`);
}

const withdrawBet = async (address, isWon, amount, ROI) => {
    let clientPubKey = new web3.PublicKey(address);

    const recentBH = await connection.getLatestBlockhash();

    let transferTransaction = new web3.Transaction(
        // {
        //     feePayer: keypair.publicKey,
        //     // signatures: [{
        //     //     pubkey: keypair.publicKey,
        //     //     signature: null
        //     // }],
        //     blockhash: recentBH,
        //     lastValidBlockHeight: recentBH.height,
        // }
    );
    
    // check if won
    // if won roi to pda from main account & roi+amount to client
    // if lost send amount to main account

    if(isWon) {
        let ROIInstruction = web3.SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: pdaAccount.publicKey,
            lamports: ROI,
            programId,
        });
        
        transferTransaction.add(ROIInstruction);

        let amountInstruction = web3.SystemProgram.transfer({
            fromPubkey: pdaAccount.publicKey,
            toPubkey: clientPubKey.publicKey,
            lamports: amount + ROI,
            programId,
        });

        transferTransaction.add(amountInstruction);

        await web3.sendAndConfirmTransaction(
            connection, 
            transferTransaction, 
            [pdaAccount, keypair]
        );

    }else{
        let amountInstruction = web3.SystemProgram.transfer({
            fromPubkey: pdaAccount.publicKey,
            toPubkey: keypair.publicKey,
            lamports: amount,
            programId,
        });

        transferTransaction.add(amountInstruction);

        await web3.sendAndConfirmTransaction(
            connection, 
            transferTransaction, 
            [keypair, pdaAccount]
        );
    }

    // let secret = new Uint8Array([44,103,173,91,23,56,13,22,109,7,88,175,221,86,227,68,135,219,29,171,131,14,52,86,188,124,140,247,34,58,19,216,20,116,36,144,35,248,28,184,254,89,145,55,158,192,11,55,86,159,62,136,76,54,6,29,118,10,197,179,102,101,51,195])
    // let clientPubKey = web3.Keypair.fromSecretKey(secret);

    // const recentBH = await connection.getLatestBlockhash();
    
    // const transaction = new web3.Transaction({
    //     feePayer: keypair.publicKey,
    //     signatures: [{
    //         pubkey: keypair.publicKey,
    //         signature: {
    //             type: 'buffer',
    //             data: [44,103,173,91,23,56,13,22,109,7,88,175,221,86,227,68,135,219,29,171,131,14,52,86,188,124,140,247,34,58,19,216,20,116,36,144,35,248,28,184,254,89,145,55,158,192,11,55,86,159,62,136,76,54,6,29,118,10,197,179,102,101,51,195],
    //             publicKey: keypair.publicKey,
    //         }
    //     }],
    //     blockhash: recentBH,
    //     lastValidBlockHeight: recentBH.height,
    // }).add(
    //     web3.SystemProgram.transfer({
    //       programId,
    //       fromPubkey: pdaAccount.publicKey,
    //       toPubkey: clientPubKey.publicKey,
    //       lamports: amount,
    //     })
    // );
  
    // await web3.sendAndConfirmTransaction(
    //     connection,
    //     transaction,
    //     [keypair, pdaAccount]
    // )

}


initEscrow = async () => {
    await establishConnection();
    await connectWallet();
    await createPDAAccount();
    
    await getBalance(pdaAccount.publicKey);
    await getBalance(keypair.publicKey);
    
    let clientPubKey = new web3.PublicKey("6hvdYCWxFH3bQHKAjXeheUee1HJbp382kQzySwd8LpRk");
    await getBalance(clientPubKey.publicKey);

    await withdrawBet("6hvdYCWxFH3bQHKAjXeheUee1HJbp382kQzySwd8LpRk", false, 10000, 10);

    await getBalance(clientPubKey.publicKey);
    await getBalance(pdaAccount.publicKey);
    await getBalance(keypair.publicKey);
}

initEscrow();
