const mongoose = require('mongoose');

const repoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    repoName: String,
    userID: String,
    description: String,
    access: String,
    creationDate: Date,
    lastUpdated: Date,
    numVisits: Number,
    numForks: Number,
    numStars: Number
    },
    {versionKey: false});   //not keeping document versioned

module.exports = mongoose.model('Repositories', repoSchema);