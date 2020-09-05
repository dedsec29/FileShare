const mongoose = require('mongoose');

const repoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    repoName: {type: String, required: true},
    userID: {type: String, required: true},
    description: String,
    access: {type: String, required:true},
    creationDate: {type:Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now},
    numVisits: Number,
    numForks: Number,
    numStars: Number
    },
    {versionKey: false});   //not keeping document versioned

module.exports = mongoose.model('Repositories', repoSchema);