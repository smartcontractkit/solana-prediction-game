import { Flex, Show, Text } from "@chakra-ui/react";
import Logo from "./Logo";
import CountdownTimer from "./CountdownTimer";
import MenuWallet from "./Wallet";


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