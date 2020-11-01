const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true,
  },
  picture: {
    type: String,
  },
});

module.exports = mongoose.model('Upload', uploadSchema);
