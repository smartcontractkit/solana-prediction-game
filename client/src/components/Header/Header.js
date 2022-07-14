import { useEffect } from "react";
import { Box, Flex, Text, Button, Stack, HStack, Avatar, Show, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import Logo from "./Logo";
import {
  useMoralis,
  useMoralisSolanaApi,
  useMoralisSolanaCall,
} from "react-moralis";
import CountdownTimer from "./CountdownTimer";
import { getTruncatedAddress, roundOff } from "../../helpers/sol_helpers";


const Header = (props) => {

  return (
    <NavBarContainer {...props}>
      <Logo />
      <Show above="sm">
        <MenuNextPrediction />
      </Show>
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

const CustomMenuItem = ({ children, ...props }) => {
  return (
    <MenuItem  
      bg="gray.900"
      _hover={{
        bg: "gray.800",
      }}
      _focus={{
        bg: "gray.900",
      }}
    {...props}>
      {children}
    </MenuItem>
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
  const { fetch, data } = useMoralisSolanaCall(account.getPortfolio);

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
          <Menu >
            <MenuButton 
              as={Button}
              size="sm"
              rounded="md"
              bg="whiteAlpha.50"
              _hover={{
                bg: "whiteAlpha.300",
              }}
            >
              <Stack
                spacing={[2, 4, 8, 8]}
                align="center"
                justify="space-between"
                direction="row"
              >
                {
                  data && 
                  (
                  <Text fontWeight="bold">
                    { `${roundOff(data.nativeBalance?.solana, 3)} SOL` }
                  </Text>
                  )
                }
                <HStack>
                  <Show above="sm">
                    <Text color="gray.400" fontWeight={400}>
                      { getTruncatedAddress(user.get("solAddress")) }
                    </Text>
                  </Show>
                  <Avatar size="xs" bg='red.500' />
                  <ChevronDownIcon />
                </HStack>
              </Stack>
            </MenuButton>
            <MenuList 
              rounded="md"
              border="1px solid"
              borderColor="whiteAlpha.300"
              bg="gray.900"
            >
              <CustomMenuItem onClick={logout}>Disconnect</CustomMenuItem>
            </MenuList>
          </Menu>
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
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Header;