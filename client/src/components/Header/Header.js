import { useState, useEffect } from "react";
import { Box, Flex, Text, Button, Stack, HStack, Avatar } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons'

import Logo from "./Logo";
import {
  useMoralis,
  useMoralisSolanaApi,
  useMoralisSolanaCall,
} from "react-moralis";
import CountdownTimer from "./CountdownTimer";


const Header = (props) => {

  return (
    <NavBarContainer {...props}>
      <Logo />
      <MenuNextPrediction />
      <MenuWallet />
    </NavBarContainer>
  );
};

const MenuNextPrediction = () => {
  const predictionTime = new Date().setUTCHours(24,0,0,0); // TODO to be changed to next prediction time

  return (
    <Flex>
      <Text>
        Next prediction in:&nbsp;
      </Text>
      <CountdownTimer 
        targetDate={predictionTime} 
        color={"yellow.400"} 
        fontWeight={"bold"} />
    </Flex>
  );
}

const MenuWallet = () => {
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
      fetch({
        params: {
          address: user.get("solAddress"),
          network,
        },
      });
    }
  }, [fetch, isAuthenticated, user, network]);

  const round = (num) => {
    return Math.round(num * 1000) / 1000;
  }

  return (
    <Box>
      {
        !isAuthenticated ? (
          <Button
            size="sm"
            roounded="md"
            border="1px solid"
            borderColor="whiteAlpha.300"
            bg="transparent"
            _hover={{
              bg: "whiteAlpha.300",
            }}
            isLoading={isAuthenticating}
            loadingText="Connecting..."
            onClick={onConnectPhantomWallet}
          >
            Connect Wallet
          </Button>
        ) : (
          <Stack
            spacing={[2, 4, 8, 8]}
            align="center"
            justify="space-between"
            direction="row"
            py="8px"
            px="14px"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="12px"
            onClick={logout}
          > 
            <Text fontWeight="bold">
              { data && (`${round(data.nativeBalance?.solana)} SOL`) }
            </Text>
            <HStack>
              <Text color="gray.400">
              { user?.get("solAddress").slice(0, 6) }...{ user?.get("solAddress").slice(-4) }
              </Text>
              <Avatar size="xs" bg='red.500' />
              <ChevronDownIcon />
            </HStack>
          </Stack>
        )
      }
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
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Header;