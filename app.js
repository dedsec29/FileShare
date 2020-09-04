const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://Parth:'+process.env.DB_PASSWORD+'@cluster0.5b4sy.mongodb.net/Parth?retryWrites=true&w=majority';

module.exports = app;