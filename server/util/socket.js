const { Server } = require("socket.io");
const { getChainlinkFeed } = require("../controllers/feed.controller");

const connectSocket = (server) => {

    const io = new Server(server, {
        cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
        }
    });

    io.on('connection', (socket) => {
        socket.on('request_data_feed', (feed) => {
        console.log(`feedAddress: ${feed.feedAddress}`);
        console.log(`User Id: ${socket.client.id}`);
        socket.join(feed.feedAddress);
        getChainlinkFeed(io, feed);
        });
    });
}

module.exports = connectSocket;