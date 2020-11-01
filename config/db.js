const mongoose = require('mongoose');

const connectionString =
  'mongodb+srv://Parth:' +
  process.env.DB_PASSWORD +
  '@cluster0.5b4sy.mongodb.net/' +
  process.env.DB_NAME +
  '?retryWrites=true&w=majority';

module.exports = {
    dbConnection:()=> {
        mongoose
        .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        })
        .then(() => console.log('Connected to database!'))
        .catch((err) => console.log(err));
    }
}