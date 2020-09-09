const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userID: {
        type: String, 
        required: [true, "User ID required"],
        trim: true,
        index: {unique: true},
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
        validate: {
            validator: (v)=>{
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Invalid e-mail"
        }
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: [6, "Password should be at least 6 characters long"],
        maxlength: [15, "Password should be at most 15 characters long"]
    },
    status: String,
    },
    {versionKey: false}
);

module.exports = mongoose.model('User', userSchema);