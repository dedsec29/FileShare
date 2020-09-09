const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Repository = require('../models/repository'); //collection (mongo by default makes this to plural)

router.get('/', (req, res, next)=> {
    res.status(200).json({
        message: 'Handling GET requests to /repositories'
    });
});

//creating new repo
router.post('/', (req, res, next)=> {
    Repository.findOne({userID: req.body.userID, repoName: req.body.repoName}).exec() //'exec' then 'then' ensures a true promise (alternative: make mongoose.promise=global.promise)
    .then(data=> {
        if (data) {
            res.status(400).json({
                message: "This repository for the user already exists"
            });
            return;
        }
        //Now data is null, we can safely create
        let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements

        const repo = new Repository(obj);
        //save this
        repo.save() //.save() returns a true promise, unlike .find() etc so don't .exec()
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
        res.status(400).json({error: err});
    });
});

//display all repositories
router.get('/all', (req, res, next)=> {
    Repository.find()
    .then(results=> {res.send(results); console.log(results)})
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    })
});

//delete a repository
router.delete('/:userID/:repoName', (req, res, next)=> {
    let userID = req.params.userID;
    let repoName = req.params.repoName;
    Repository.deleteOne({userID:userID, repoName:repoName}).exec()
    .then(results=> res.status(200).json(results))
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//update repository details (changing username or repository name should be reflected every other place)
router.put('/:userID/:repoName', (req, res, next)=> {
    let userID = req.params.userID;
    let repoName = req.params.repoName;
    let obj = JSON.parse(JSON.stringify(req.body));     //copying body elements
    Repository.updateOne({userID:userID, repoName:repoName}, {$set: obj}).exec()
    .then(results=> {
        console.log(results);
        res.status(200).json(results);
    })
    .catch(err=> {
        console.log(err);
        res.status(400).json({error:err});
    })
}); 

module.exports = router;