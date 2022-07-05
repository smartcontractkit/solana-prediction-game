import { Button } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useMoralis } from 'react-moralis';

export const SendFromEscrowAddress = () => {
    const { user } = useMoralis();
    const [ isSending, setIsSending ] = useState(false);
    const [ data, setData ] = useState(null);


    const onClick = useCallback(async () => {
        setIsSending(true);

        const toAddress = user.get("solAddress");
        const amount = 0.5;

        fetch(`${process.env.REACT_APP_SERVER_URL}/escrowTransferSOL`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST",
              "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
            },
            body: JSON.stringify({
                toAddress,
                amount,
            })
          })
          .then(res => res.json())
          .then(res => {
            setData(res);
            setIsSending(false);
            alert("Transfer successful: " + data?.transactionId);
          })
          .catch(err => {
            setIsSending(false);
            alert("Error occured: " + err.message);
          });

    }, [user]);

    return (
        <Button
            size="sm"
            rounded="md"
            color={["white", "white", "white", "white"]}
            bg={["black", "black", "black", "black"]}
            _hover={{
                bg: ["primary.700", "primary.700", "primary.700", "primary.700"]
            }}
            isLoading={isSending}
            loadingText="Sending..."
            onClick={onClick}
            >
            Send 0.5 SOL from escrow
        </Button>
    );
};
