const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectionString = 'mongodb+srv://Parth:'+process.env.DB_PASSWORD+'@cluster0.5b4sy.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority';
mongoose.connect(connectionString,  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(()=> console.log('Connected to database!'))
.catch((err)=> console.log(err));

const repoRoute = require('./api/routes/repositories');
const usersRoute = require('./api/routes/users');

//initialising routes
app.use('/repositories', repoRoute);
app.use('/users', usersRoute);

module.exports = app;