import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, Button, Stack, HStack, Avatar, Show } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { roundOff } from "../../helpers/solHelpers";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomWalletConnectButton from "./CustomWalletConnectButton";
import CustomWalletModalButton from "./CustomWalletModalButton";
import { UserDataContext } from "../../contexts/UserDataProvider";

const MenuWallet = ({ children, ...props }) => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const { balance } = useContext(UserDataContext);
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef(null);

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
      if (children) return children;
      if (!wallet || !base58) return null;
      return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [children, wallet, base58]);

    const copyAddress = useCallback(async () => {
      if (base58) {
        await navigator.clipboard.writeText(base58);
        setCopied(true);
        setTimeout(() => setCopied(false), 400);
      }
    }, [base58]);

    const openDropdown = useCallback(() => {
      setActive(true);
    }, []);

    const closeDropdown = useCallback(() => {
      setActive(false);
    }, []);

    const openModal = useCallback(() => {
      setVisible(true);
      closeDropdown();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [closeDropdown]);

    useEffect(() => {
      const listener = (event) => {
        const node = ref.current;

        // Do nothing if clicking dropdown or its descendants
        if (!node || node.contains(event.target)) return;

        closeDropdown();
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }, [ref, closeDropdown]);

    if (!wallet) return <CustomWalletModalButton {...props}>{children}</CustomWalletModalButton>;
    if (!base58) return <CustomWalletConnectButton {...props}>{children}</CustomWalletConnectButton>;

    return (
      <div className="wallet-adapter-dropdown">
        <Button 
          size="sm"
          rounded="md"
          bg="whiteAlpha.50"
          _hover={{
            bg: "whiteAlpha.300",
          }}
          onClick={openDropdown}
        >
          <Stack
            spacing={[2, 4, 8, 8]}
            align="center"
            justify="space-between"
            direction="row"
          >
            {
              balance && 
              (
              <Text fontWeight="bold">
                { `${roundOff(balance, 3)} SOL` }
              </Text>
              )
            }
            <HStack>
              <Show above="sm">
                <Text color="gray.400" fontWeight={400}>
                  { content }
                </Text>
              </Show>
              <Avatar size="xs" bg='red.500' src={`https://api.multiavatar.com/${base58}.png`} />
              <ChevronDownIcon />
            </HStack>
          </Stack>
      </Button>
      <ul
          aria-label="dropdown-list"
          className={`wallet-adapter-dropdown-list ${active && 'wallet-adapter-dropdown-list-active'}`}
          ref={ref}
          role="menu"
      >
          <li onClick={copyAddress} className="wallet-adapter-dropdown-list-item" role="menuitem">
              {copied ? 'Copied' : 'Copy address'}
          </li>
          <li onClick={openModal} className="wallet-adapter-dropdown-list-item" role="menuitem">
              Change wallet
          </li>
          <li onClick={disconnect} className="wallet-adapter-dropdown-list-item" role="menuitem">
              Disconnect
          </li>
      </ul>
    </div>
  );
};

export default MenuWallet;