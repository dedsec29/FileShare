const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    userID: {type: String, required: true}
});