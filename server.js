const express = require('express');

const setupEnv = require('./api/config/env');
const dbConnection = require('./api/config/db');
setupEnv();
dbConnection();

const app = require('./app');
const port = process.env.PORT || 3000;

const server = express();
server.use(app);
server.listen(port, console.log(`Server running on port ${port}`));
