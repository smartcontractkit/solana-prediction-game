const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
require('dotenv').config();

const { connectToDatabase } = require("./util/mongoose");

const usersRouter = require('./routes/users.route');
const betsRouter = require('./routes/bets.route');
const transactionsRouter = require('./routes/transactions.route');
const feedRouter = require('./routes/feed.route');
const predictionsRouter = require('./routes/predictions.route');
const connectSocket = require("./util/socket");

app.use('/users', usersRouter);
app.use('/bets', betsRouter);
app.use('/transactions', transactionsRouter);
app.use('/feed', feedRouter);
app.use('/predictions', predictionsRouter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server listening on ${PORT}`);
});

connectSocket(server);
