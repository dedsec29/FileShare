/* eslint-disable no-undef */
const express = require('express');
const app = express();
const morgan = require('morgan'); //to log incoming requests
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const supportedRequests = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'].join(', '); //HTTPS requests we wanna allow for our API
//putting cors headers to prevent cors errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    //because before requests like PUT and POST, browser always sends OPTIONS asking whether it can use those requests
    res.header('Access-Control-Allow-Methods', supportedRequests);
    return res.status(200).json({}); //approve 'okay'
  }
  //if we don't receive OPTIONS, continue to other requests
  next();
});

const repoRoute = require('./api/routes/repositories');
const usersRoute = require('./api/routes/users');
const uploadRoute = require('./api/routes/uploads');
const dbConnection = require('./api/config/db');

//setting up connection
dbConnection();

//initialising routes
app.use('/repositories', repoRoute);
app.use('/users', usersRoute);
app.use(uploadRoute);
app.use(express.static('./uploads'));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

module.exports = app;
