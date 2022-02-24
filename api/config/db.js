const mongoose = require('mongoose');
const setupEnv = require('./env');  //for testing 
setupEnv();

//get current env variable
var envStr = process.env.NODE_ENV;
console.log(envStr);
envStr = envStr.toUpperCase();

const connectionString =
  'mongodb+srv://Parth:' +
  process.env.DB_PASSWORD +
  '@cluster0.5b4sy.mongodb.net/' +
  process.env['DB_NAME_' + envStr] +
  '?retryWrites=true&w=majority';

module.exports = ()=> {
  mongoose
  .connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  })
  .then(() => console.log('Connected to database!'))
  .catch((err) => console.log(err));
}