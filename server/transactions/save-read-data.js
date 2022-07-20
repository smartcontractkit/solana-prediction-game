const web3 = require('@solana/web3.js');
var bs58 = require('bs58');
let keypair;
const memoProgramId = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const memoProgramKey = new web3.PublicKey(memoProgramId);
const programId = new web3.PublicKey("7bAt59dk7gSgxTG4pqMFKGuPcvV541NT9k1MnkbahFsm"); //privKey = 2i3TCLe1yWAWFT6wYVp7igmDEVXRrayEzyD9JsPxQR42hUbnXC8Fj1FpJitv8PEVv4hWcQjJJn1jt46svb8HAb8b
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

saveData = async (data) => {
    let transferTransaction = new web3.Transaction();

    transferTransaction.add(new web3.TransactionInstruction({
        programId: memoProgramId,
        keys: [{
            pubkey: keypair.publicKey,
            isSigner: true,
            isWritable: false,
        }],
        data: Buffer.from(JSON.stringify(data))
    }))

    const transcationHash =  await web3.sendAndConfirmTransaction(
        connection, 
        transferTransaction, 
        [keypair]
    );

    return transcationHash;
}

readTransaction = async (signature) => {
    const transaction = await connection.getTransaction(signature);
    return transaction.transaction.message.instructions[0].data;
}

saveReadData = async () => {
    const signature = await saveData({
        amount: 1,
        isWon: true,
        ROI: 2,
    });

    console.log(signature);

    const b58Address = await readTransaction(signature);
    const dataAsUint8Arr = bs58.decode(b58Address);
    const jsonString = new Buffer.from(dataAsUint8Arr).toString('utf8');
    const data = JSON.parse(jsonString);

    console.log(data);
}

initConnection = async () => {
    await establishConnection();
    await connectWallet();
}

initTestReadSaveData = async () => {
    await initConnection();
    await saveReadData();
}

initTestReadSaveData();