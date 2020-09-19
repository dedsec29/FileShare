const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');

const Repository = require('../models/repository');
const User = require('../models/user'); //collection (mongo by default makes this to plural)

/* Used .then(.then()) in place of .then(throw err).then().catch() because:
    Code has multiple nested if else blocks within a .then() itself
*/

router.get('/', (req, res, next)=> {
    res.status(200).json({message: 'Handling GET requests to /users'});
});

//create new user
router.post('/signup', (req, res, next)=> {
    User.exists({userID: req.body.userID})
    .then(data=> {
        if (data) {
            res.status(409).json({message: "User ID taken"});
            return;
        }
        let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements
        //hash the password
        bcrypt.hash(obj['password'], 10)     //10 is the salt argument
        .then(hash=> {
                obj['password'] = hash;
                obj['email'] = obj['email'].toLowerCase();
                let userObj = new User(obj);
                userObj.save()
                .then(results=> {
                    console.log(results);
                    res.status(201).json({
                        message: "Handling POST requests to /users",
                        createdUser: results
                    });
                })
                .catch(err=> {
                    console.log(err);
                    res.status(500).json({error: err});
                });
        })    
        .catch(err=> {
            res.status(500).json({
                error: err,
                message: "Password and/or Email field missing"
            });
        });
        
    })
    .catch(err=> {
        console.log(err);
        res.status(400).json({error: err});
    });
});

/*  Display all users (For future: Remember to not display password of users.
    Also display selective details if user 'Access' is private) */
router.get('/all', checkAuth, (req, res, next)=> {
    User.find()
    .then(results=> {res.send(results); console.log(results)})
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//delete a user, also all its repositories too
router.delete('/:userID', checkAuth,(req, res, next)=> {
    let userID = req.params.userID;
    User.deleteOne({userID: userID}).exec()
    .then(results1=> {
        if (results1['deletedCount']==0) {
            console.log(results1);
            res.status(400).json({
                message: "User does not exist, cannot delete",
                result: results1
            });
        }
        else {
            Repository.deleteMany({userID: userID}).exec()
            .then(results2=> {
                console.log(results2);
                res.status(200).json({
                    message: "deletion successful",
                    result: results2
                });
            })
            .catch(err=> {
                console.log(err);
                res.status(500).json({error: err});
            });
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//update user details. If userID itself is changed, reflect the changes on Repository model as well
router.put('/:userID', checkAuth, (req, res, next)=> {
    let userID = req.params.userID;
    let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements
    User.updateOne({userID: userID}, {$set: obj}).exec()
    .then(results1=> {
        if (results1['nModified']==0) {
            console.log(results1)
            if (results1['n']==0) {
                res.status(400).json({
                    message: "User does not exist, cannot update", 
                    result: results1
                });
            }
            else {  //else it means that user exists, but details were same as original
                res.status(200).json({
                    message: "Nothing to update",
                    result: results1
                });
            }
        }
        else {
            //user details updated. If userID updated, reflect changes in other models
            if (obj.hasOwnProperty('userID') && userID!=obj['userID']) {
                Repository.updateMany({userID: userID}, {$set: {userID: obj['userID']} }).exec()
                .then(results2=> {
                    console.log(results2);
                    res.status(200).json({
                        message: "Updates Applied",
                        result: results2
                    }); 
                })
                .catch(err=> {
                    console.log(err);
                    res.status(500).json({error: err});
                });
            }
            else {
                console.log(results1);
                res.status(200).json({
                    message: "Updates Applied",
                    result: results1
                }); 
            }
        }
    })
    .catch((err)=> {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/login', (req, res, next)=> {
    //User can log in using either email or userID
    let qry = {};
    if (req.body.hasOwnProperty('userID'))
        qry['userID'] = req.body.userID;
    else if (req.body.hasOwnProperty('email'))
        qry['email'] = req.body.email;
    else 
        return res.status(400).json({message: "Email or UserID was not provided"});

    if (req.body.hasOwnProperty('password')==false)
        return res.status(400).json({message: "Password was not provided"});
    
    User.find(qry).exec()
    .then(user=> {
        if (user.length < 1) {
            return res.status(401).json({message: "Authorization failed"}); //do not indicate that user doesn't exist for security reasons
        }
        bcrypt.compare(req.body.password, user[0].password)
        .then(result=> {
            if (result) {
                const token = jwt.sign(
                    {   //payload of token
                        userID: user[0].userID,
                        email: user[0].email
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );

                return res.status(200).json({
                    message: "Authorization successful",
                    token: token
                });
            }
            else {
                return res.status(401).json({message: "Authorization failed"});
            }
        })
        .catch(err=> {
            res.status(401).json({message: "Authorization failed"});
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
})

module.exports = router;
