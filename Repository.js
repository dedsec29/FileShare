const mongoose = require('mongoose');

const repoSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    repoName: {type: String, required: true},
    userID: {type: String, required: true},
    description: String,
    access: {type: String, required:true},
    creationDate: {type:Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now},
    numVisits: {type: Number, default: 1},
    numForks: {type: Number, default: 0},
    numStars: {type: Number, default: 0}
    },
    {versionKey: false});   //not keeping document versioned

module.exports = mongoose.model('Repositories', repoSchema);