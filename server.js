const express = require('express');


if (process.env.NODE_ENV !== 'production')
  //if still in dev stage, use the env variables
  require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 3000;

const server = express();
server.use(app);
server.listen(port, console.log(`Server running on port ${port}`));
