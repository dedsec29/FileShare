const mongoose = require('mongoose');

//get current env variable
const envStr = process.env.NODE_ENV.toUpperCase();

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