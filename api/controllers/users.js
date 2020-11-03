const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Repository = require('../models/repository');
const User = require('../models/user');

const saltAmount = 10;
const tokenExpireTime = "1h";

exports.createUser = (req, res, next)=> {
    const requiredFields = ['email', 'userID', 'password', 'name'];
    for (let prop of requiredFields) {
        if (!req.body.hasOwnProperty(prop))
            return res.status(400).json({message: "Missing required details"});
    }
    User.exists({userID: req.body.userID})
    .then(data1=> {
        if (data1) {
            return res.status(409).json({message: "User ID taken"});
        }
        User.exists({email: req.body.email})
        .then(data2=> {
            if (data2) {
                return res.status(409).json({message: "Email ID taken"});
            }
            let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements
            //hash the password
            bcrypt.hash(obj['password'], saltAmount)
            .then(hash=> {
                obj['password'] = hash;
                obj['email'] = obj['email'].toLowerCase();
                let userObj = new User(obj);
                return userObj.save()
            }) 
            .then(results=> {
                //console.log(results);
                res.status(201).json({message: "User created"});
            })   
            .catch(err=> {
                console.log(err);
                res.status(500).json({error: err});
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error: err});
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.displayUsers = (req, res, next)=> {
    User.find()
    .then(results=> {res.send(results); console.log(results)})
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.deleteUser = (req, res, next)=> {
    let userID = req.params.userID;
    User.deleteOne({userID: userID}).exec()
    .then(results1=> {
        if (results1['deletedCount']==0) {
            //console.log(results1);
            res.status(400).json({
                message: "User does not exist, cannot delete",
                result: results1
            });
        }
        else {
            Repository.deleteMany({userID: userID}).exec()
            .then(results2=> {
                //console.log(results2);
                res.status(200).json({message: "deletion successful",});
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
}

exports.updateUser = async (req, res, next)=> {
    let userID = req.params.userID;
    let obj = JSON.parse(JSON.stringify(req.body));    //copying body elements
    if (obj.hasOwnProperty('password')) { //password needed to be updated needs to be hashed too
        try {
            obj['password'] = await bcrypt.hash(obj['password'], saltAmount);
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({error: err});
        }
    }
    User.updateOne({userID: userID}, {$set: obj}).exec()
    .then(results1=> {
        if (results1['nModified']==0) {
            //console.log(results1)
            if (results1['n']==0) {
                res.status(400).json({
                    message: "User does not exist, cannot update"
                });
            }
            else {  //else it means that user exists, but details were same as original
                res.status(200).json({
                    message: "Nothing to update"
                });
            }
        }
        else {
            //user details updated. If userID updated, reflect changes in other models
            if (obj.hasOwnProperty('userID') && userID!=obj['userID']) {
                Repository.updateMany({userID: userID}, {$set: {userID: obj['userID']} }).exec()
                .then(results2=> {
                    //console.log(results2);
                    res.status(200).json({
                        message: "Updates Applied"
                    }); 
                })
                .catch(err=> {
                    console.log(err);
                    res.status(500).json({error: err});
                });
            }
            else {
                //console.log(results1);
                res.status(200).json({
                    message: "Updates Applied"
                }); 
            }
        }
    })
    .catch((err)=> {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.login = (req, res, next)=> {
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
                        expiresIn: tokenExpireTime
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
}