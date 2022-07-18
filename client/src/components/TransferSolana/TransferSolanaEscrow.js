import { Button } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useMoralis } from 'react-moralis';
import axiosInstance from '../../helpers/axiosInstance';

export const SendFromEscrowAddress = () => {
  const { user } = useMoralis();
  const [isSending, setIsSending] = useState(false);


  const onClick = useCallback(async () => {
    setIsSending(true);

    const toAddress = user.get("solAddress");
    const amount = 0.5;

    axiosInstance.post('/escrowTransferSOL',
      {
        toAddress,
        amount
      }
    )
      .then(res => res.data)
      .then(res => {
        setIsSending(false);
        alert("Transfer successful: " + res?.transactionId);
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
