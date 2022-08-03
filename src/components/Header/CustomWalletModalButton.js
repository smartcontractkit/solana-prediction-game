import { Button } from '@chakra-ui/react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback } from 'react';

export const CustomWalletModalButton = ({ children = 'Connect Wallet', onClick, ...props }) => {
    const { visible, setVisible } = useWalletModal();

    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event);
            if (event.defaultPrevented) {
                return
            }
            setVisible(!visible);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onClick, visible]
    );

    return (
        <Button
            size="sm"
            roounded="md"
            bg="blue.300"
            color="gray.800"
            _hover={{
                bg: "whiteAlpha.300",
                color: "whiteAlpha.800",
            }}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    );
};
export default CustomWalletModalButton; 