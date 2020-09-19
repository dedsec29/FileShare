const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=> {
    try {
        const token = req.headers.authorization.split(" ")[1].trim();  //0: Bearer, 1: token
        console.log(token);
        req.userData = jwt.verify(token, process.env.JWT_KEY);  //verifies then decodes, returns the payload 
        next();
    }
    catch (error) {
        return res.status(401).json({message: "Authorization failed"});
    }
};