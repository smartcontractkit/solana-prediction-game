import { Button } from '@chakra-ui/react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback } from 'react';

export const WalletModalButton = ({ children = 'Connect Wallet', onClick, ...props }) => {
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
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    );
};
export default WalletModalButton; 