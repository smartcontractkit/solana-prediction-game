import { VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { UserDataContext } from '../../contexts/UserDataProvider';
import BetWonNotification from './BetWonNotification';

const BetWonNotifications = () => {
    const { myBets } = useContext(UserDataContext);

    if(!myBets) {
        return
    }

    const myBetsWon = myBets.filter(bet => bet.status === "won");

    if(myBetsWon.length === 0) {
        return
    }

    return (
        <VStack w="100%">
            {myBetsWon.map((bet) => <BetWonNotification key={bet._id} />)}
        </VStack> 
    )
}

export default BetWonNotifications;