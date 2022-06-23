import { useState, useEffect } from "react";
import { Link, Box, Flex, Text, Button, Stack } from "@chakra-ui/react";

import Logo from "./Logo";

import {
  useMoralis,
  useMoralisSolanaApi,
  useMoralisSolanaCall,
} from "react-moralis";


const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <Logo
        w="100px"
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="white"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = ({ isOpen }) => {
  const network = "devnet"
  const {
    isAuthenticated,
    authenticate,
    user,
    isAuthenticating,
    logout,
  } = useMoralis();
  const { account } = useMoralisSolanaApi();
  const { fetch, data, isLoading } = useMoralisSolanaCall(account.getPortfolio);

  /**
   * @description the function handles authentication with phantom wallet
   */
  const onConnectPhantomWallet = async () => {
    await authenticate({
      type: "sol",
    });
  };

  useEffect(() => {
    if (isAuthenticated && user.get("solAddress")) {
      // Fetch only when authenticated
      fetch({
        params: {
          address: user.get("solAddress"),
          network,
        },
      });
    }
  }, [fetch, isAuthenticated, user, network]);

  const round = (num) => {
    return Math.round(num * 1000) / 1000
  }

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/">Home</MenuItem>
        {
          !isAuthenticated ? (
            <Button
              size="sm"
              rounded="md"
              color={["black", "black", "black", "black"]}
              bg={["white", "white", "primary.500", "primary.500"]}
              _hover={{
                bg: ["primary.100", "primary.100", "primary.600", "primary.600"]
              }}
              isLoading={isAuthenticating}
              loadingText="Connecting..."
              onClick={onConnectPhantomWallet}
            >
              Connect Wallet
            </Button>
          ) : (
            <>
              { data && !isLoading && (<p>{round(data.nativeBalance?.solana)} SOL</p>)}
              <Button
                size="sm"
                rounded="md"
                color={["black", "black", "black", "black"]}
                bg={["white", "white", "primary.500", "primary.500"]}
                _hover={{
                  bg: ["primary.100", "primary.100", "primary.600", "primary.600"]
                }}
                isLoading={isAuthenticating}
                loadingText="Connecting..."
                onClick={logout}
              >
                { user?.get("solAddress").slice(0, 6) }...{ user?.get("solAddress").slice(-4) }
              </Button>
            </>
          )
        }
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["black", "black", "black", "black"]}
      color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Header;