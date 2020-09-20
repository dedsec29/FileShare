const mongoose = require('mongoose');

const Repository = require('../models/repository');

exports.createRepo = (req, res, next)=> {
    Repository.exists({userID: req.body.userID, repoName: req.body.repoName})
    .then(data=> {
        if (data) {
            return res.status(409).json({message: "This repository for the user already exists"});
        }
        //Now data is null, we can safely create
        let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements

        let repo = new Repository(obj);
        //save this
        repo.save() //.save() returns a true promise, unlike .find() etc so don't .exec()
        .then(results=> { //sending appropriate status
            console.log(results);
            res.status(201).json({
                message: "Handling POST requests to /repositories/"+req.params.userID,
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
}

exports.displayRepos = (req, res, next)=> {
    Repository.find()
    .then(results=> {res.send(results); console.log(results)})
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.deleteRepo = (req, res, next)=> {
    let userID = req.params.userID;
    let repoName = req.params.repoName;
    Repository.deleteOne({userID:userID, repoName:repoName}).exec()
    .then(results=> {
        console.log(results);
        if (results['deletedCount']!=0) {
            res.status(200).json({
                message: "Deleted Successfully",
                result: results
            });
        }
        else {
            res.status(400).json({
                message: "Couldn't find such repository or userID or combination of both",
                result: results
            });
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.updateRepo = (req, res, next)=> {
    let userID = req.params.userID;
    let repoName = req.params.repoName;
    let obj = JSON.parse(JSON.stringify(req.body));     //copying body elements (can additionally ensure that userID is not in body received)
    Repository.updateOne({userID:userID, repoName:repoName}, {$set: obj}).exec()
    .then(results=> {
        console.log(results);
        if (results['nModified']!=0) {
            res.status(200).json({
                message: "Update successful",
                result: results
            });
        }
        else {
            if (results['n']!=0) {
                res.status(400).json({
                    message: "Couldn't find such repository", //if could not find userID, We will throw auth error for security reasons (in check-auth middleware)
                    result: results
                });
            }
            else { //Did not update because details were same as original
                res.status(200).json({
                    message: "Nothing to update",
                    result: results
                })
            }
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(400).json({error:err});
    });
}