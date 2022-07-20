import { Button } from '@chakra-ui/react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback } from 'react';

export const CustomWalletModalButton = ({ children = 'Connect Wallet', onClick, ...props }) => {
    const { visible, setVisible } = useWalletModal();

    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) setVisible(!visible);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onClick, visible]
    );

    return (
        <Button
            size="sm"
            roounded="md"
            border="1px solid"
            borderColor="whiteAlpha.300"
            bg="transparent"
            _hover={{
                bg: "whiteAlpha.300",
            }}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    );
};
export default CustomWalletModalButton; 