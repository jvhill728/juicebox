require('dotenv').config();

const { client } = require('./db');
client.connect();

const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const morgan = require('morgan');

server.use(morgan('dev'));
server.use(express.json())
server.use('/api', apiRouter);


server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<____Body Logger END____>");

  next();
});


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

