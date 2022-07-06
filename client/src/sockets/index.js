import io from "socket.io-client";
import { socketEvents } from "./events";
import { getDataFeed } from "./emit";
export const socket = io(process.env.REACT_APP_SERVER_URL);

export const initSockets = ({ setValue }) => {
    socketEvents({ setValue });
    getDataFeed();
};