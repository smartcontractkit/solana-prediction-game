import { Flex } from "@chakra-ui/react";
import Logo from "./Logo";
import MenuWallet from "./Wallet";


const Header = (props) => {

  return (
    <NavBarContainer {...props}>
      <Logo />
      <MenuWallet />
    </NavBarContainer>
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
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Header;