import { socket } from "./index";
import { CURRENCY_PAIRS } from '../lib/constants';

export const getDataFeed = () => {
    const feedPairs = CURRENCY_PAIRS;
    feedPairs.forEach(pair => {
        socket.emit('request_data_feed', {
            feedAddress: pair.feedAddress,
            pair: pair.pair
        });
    });
};