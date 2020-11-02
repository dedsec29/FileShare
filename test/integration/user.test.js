const dbConnection = require('.../api/config/db');
const User = require('.../api/models/user');

describe('Model: User Tests', ()=> {
    before((done)=> {
        dbConnection();
        done();
    });
    beforeEach((done)=> {
        User.deleteMany({})
        .exec()
        .then(()=> done());
    });

    
});