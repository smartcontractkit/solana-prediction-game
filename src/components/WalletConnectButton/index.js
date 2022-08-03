import { Button } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useMemo } from "react";

const WalletConnectButton = ({ children, disabled, onClick, ...props }) => {
    const { wallet, connect, connecting, connected } = useWallet();
  
    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) connect().catch(() => {});
        },
        [onClick, connect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (connecting) return 'Connecting ...';
        if (connected) return 'Connected';
        if (wallet) return 'Connect Wallet';
        return 'Connect Wallet';
    }, [children, connecting, connected, wallet]);

    return (
        <Button
            onClick={handleClick}
            disabled={disabled || !wallet || connecting || connected}
            {...props}
        >
            {content}
        </Button>
    );
}

export default WalletConnectButton;