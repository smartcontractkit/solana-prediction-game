import { useEffect, useContext, useState } from 'react';
import SocketContext from '../components/SocketProvider/context'
import { CURRENCY_PAIRS } from '../lib/constants';

export function useAddressDataFeed() {

    const { dataFeeds } = useContext(SocketContext);
    const [isLoading, setIsLoading] = useState(true);
    const feedPairs = CURRENCY_PAIRS;
    
    useEffect(() => {
        if(dataFeeds.length === feedPairs.length) {
            setIsLoading(false);
        }
        // eslint-disable-next-line 
    },[dataFeeds]);

    return {
        dataFeeds,
        isLoading
    };
}