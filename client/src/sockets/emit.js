import { socket } from "./index";
import { CURRENCY_PAIRS } from '../lib/constants';

export const getDataFeed = () => {
    CURRENCY_PAIRS.forEach(pair => {
        socket.emit('request_data_feed', {
            feedAddress: pair.feedAddress,
            pair: pair.pair
        });
    });
};