const mongoose = require('mongoose');
const regexForEmailValidation = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const userSchema = mongoose.Schema({
    userID: {
        type: String, 
        required: [true, "User ID required"],
        trim: true,
        index: {unique: true}
    },
    name: {
        type: String,
        required: [true, "Name required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email required"],
        trim: true,
        index: {unique: true},
        match: regexForEmailValidation
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    status: String,
    },
    {versionKey: false}
);

module.exports = mongoose.model('User', userSchema);
