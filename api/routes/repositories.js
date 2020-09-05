const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Repositories = require('../models/repositories'); //collection

router.get('/', (req, res, next)=> {
    res.status(200).json({
        message: 'Handling GET requests to /repositories'
    });
});

//creating new repo
router.post('/', (req, res, next)=> {
    Repositories.findOne({userID: req.body.userID, repoName: req.body.repoName})
    .then(data=> {
        if (data) {
            res.status(400).json(400).json({
                message: "This repository for the user already exists"
            })
            return;
        }
        //Now data is null, we can safely create
        let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements
        obj['_id'] = new mongoose.Types.ObjectId();         //fitting obj id into the obj
        const repo = new Repositories(obj);
        //save this
        repo.save()
        .then(results=> { //sending appropriate status
            console.log(results);
            res.status(201).json({
                message: "Handling POST requests to /repositories",
                createdRepository: results
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error: err});
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(400).json(400).json({
            message: "Incorrect repository name or userID"
        });
    });
});

//display all repositories
router.get('/all', (req, res, next)=> {
    Repositories.find()
    .then(results=> {res.send(results); console.log(results)})
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    })
});

module.exports = router;