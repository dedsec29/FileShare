/* eslint-disable no-undef */
const express = require('express');
const app = express();
const morgan = require('morgan'); //to log incoming requests
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

if (process.env.NODE_ENV!=='testing')
  app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const repoRoute = require('./api/routes/repositories');
const usersRoute = require('./api/routes/users');
const uploadRoute = require('./api/routes/uploads');
const setupCors = require('./api/config/cors');

//putting cors headers to prevent cors errors
app.use(setupCors);

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
