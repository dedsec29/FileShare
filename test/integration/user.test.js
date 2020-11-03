const dbConnection = require('../../api/config/db');
const User = require('../../api/models/user');

let chai = require('chai');
let mongoose = require('mongoose');
let chaiHttp = require('chai-http');
let app = require('../../app');
const expect = chai.use(chaiHttp).expect;

describe('User Sign up Tests: ', function() {   //cannot use this.time out with arrow functions (due to mocha)
    this.timeout(12000);  //telling mocha to wait for asycn operations before timing out
    before((done)=> {   //always either return a promise in each hook, or manually call 'done()'
        dbConnection();
        done();
    });
    beforeEach( ()=> {
        return User.deleteMany({})
            .exec()
            .then();
    });

    describe('#User object', ()=> {
        it('#should not have missing details', ()=> {
            return chai
            .request(app)
            .post('/users/signup')
            .send({})
            .then((user)=> {
                expect(user).to.have.status(400);
                expect(user.body).to.be.a('object');
                expect(user.body.message).to.be.a('string').eql('Missing required details');
            });
        });
        
        describe('#should not have duplication of', ()=> {
            it('#userID', ()=> {
                let userObj = {email: "abcd@pqrs.com", userID: "judge29", password:"abc", name: "judge"};
                return chai
                .request(app)    
                .post('/users/signup')
                .send(userObj)
                .then((user)=> {
                    return chai
                    .request(app)
                    .post('/users/signup')
                    .send(userObj);
                })
                .then((user)=> {
                    expect(user).to.have.status(409);
                    expect(user.body).to.be.a('object');
                    expect(user.body.message).to.be.a('string').eql('User ID taken');
                });
            });

            it('#email', ()=> {
                let userObj = {email: "abcd@pqrs.com", userID: "judge29", password:"abc", name: "judge"};
                return chai
                .request(app)
                .post('/users/signup')
                .send(userObj)
                .then((user)=> {
                    userObj['userID'] = 'tuturu';      //changing user id to catch this test
                    return chai
                    .request(app)
                    .post('/users/signup')
                    .send(userObj);
                })
                .then((user)=> {
                    expect(user).to.have.status(409);
                    expect(user.body).to.be.a('object');
                    expect(user.body.message).to.be.a('string').eql('Email ID taken');
                });
            });
        });

        it('#if valid, gets "created" confirmation', ()=> {
            let userObj = {email: "abcd@pqrs.com", userID: "judge29", password:"abc", name: "judge"};
            return chai
            .request(app)
            .post('/users/signup')
            .send(userObj)
            .then((user)=> {
                expect(user).to.have.status(201);
                expect(user.body).to.be.a('object');
                expect(user.body.message).to.be.a('string').eql('User created');
            });
        });
    });

    after( ()=> {
        return User.deleteMany({})
            .exec()
            .then(()=> mongoose.connection.close());
    })
});
