module.exports = ()=> {
    if (process.env.NODE_ENV !== 'production')
        //if still in dev stage, use the env variables
        require('dotenv').config();
}