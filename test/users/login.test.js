const dbConnection = require('../../api/config/db');
const User = require('../../api/models/user');
const app = require('../../app');

const chai = require('chai');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const expect = chai.use(chaiHttp).expect;

describe('User tests:', function() {
    this.timeout(12000); 
    before(()=> {   
        dbConnection(); //Test login using this saved user
        let userObj = {email: "qwe@plm.com", userID: "judge", name: "epic", password: "abc"};
        return chai
        .request(app)
        .post('/users/signup')
        .send(userObj)
    });

    describe('#Login tests:', ()=> {
        describe('#Should login successfully when', ()=> {
            it('#Valid userID/email combination', ()=> {
                let promise1 = chai
                .request(app)
                .post('/users/login')
                .send({email: "qwe@plm.com", password: "abc"});
                let promise2 = chai
                .request(app)
                .post('/users/login')
                .send({userID: "judge", password: "abc"});
                return Promise.all([promise1,promise2])
                .then((results)=> {
                    for (let user of results) {
                        expect(user).to.have.status(200);
                        expect(user.body).to.be.a('object');
                        expect(user.body).to.have.property('message');
                        expect(user.body).to.have.property('token');
                        expect(user.body.message).to.be.a('string').eql('Authorization successful');
                    }
                });
            });
        });

        describe('#Should fail login when', ()=> {
            it('#Neither userID nor email provided', ()=> {
                return chai
                .request(app)
                .post('/users/login')
                .send({password: "abc"})
                .then((user)=> {
                    expect(user).to.have.status(400);
                    expect(user.body).to.be.a('object');
                    expect(user.body).to.have.property('message');
                    expect(user.body).to.not.have.property('token');
                    expect(user.body.message).to.be.a('string').eql('Email or UserID was not provided');
                });
            });

            it('#Password was not provided', ()=> {
                return chai
                .request(app)
                .post('/users/login')
                .send({userID: "judge"})
                .then((user)=> {
                    expect(user).to.have.status(400);
                    expect(user.body).to.be.a('object');
                    expect(user.body).to.have.property('message');
                    expect(user.body).to.not.have.property('token');
                    expect(user.body.message).to.be.a('string').eql('Password was not provided');
                });
            });

            it('#Incorrect credentials provided', ()=> {
                let promise1 = chai
                .request(app)
                .post('/users/login')
                .send({userID: "judge", password: "abcde"});
                let promise2 = chai
                .request(app)
                .post('/users/login')
                .send({email: "qwe@plm.com", password: "abcde"});
                return Promise.all([promise1, promise2])
                .then((results)=> {
                    for (let user of results) {
                        expect(user).to.have.status(401);
                        expect(user.body).to.be.a('object');
                        expect(user.body).to.have.property('message');
                        expect(user.body).to.not.have.property('token');
                        expect(user.body.message).to.be.a('string').eql('Authorization failed');
                    }
                });
            });
        });      
    });

    after( ()=> {
        return User.deleteMany({})
            .exec()
            .then(()=> mongoose.connection.close());
    });
});