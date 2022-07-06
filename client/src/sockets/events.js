import { socket } from './index';

export const socketEvents = ({ setValue }) => {

    socket.on('receive_data_feed', (data_feed) => {
        if(data_feed) {
            setValue(state => {
                const { dataFeeds } = state;

                const objIndex = dataFeeds.findIndex((obj => obj.pair ===  data_feed.pair));

                if(objIndex === -1) {
                    return { ...state, dataFeeds: [...dataFeeds, data_feed] };
                }
                dataFeeds.splice(objIndex, 1, data_feed);
                return { ...state, dataFeeds };
            });
        }
    });
};