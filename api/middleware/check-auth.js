const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1].trim(); //0: Bearer, 1: token
    console.log(token);
    // eslint-disable-next-line no-undef
    req.userData = jwt.verify(token, process.env.JWT_KEY); //verifies then decodes, returns the payload
    /*  Doing the next line will just give this error and overlap error cases when userID doesn't exist in the database.
            This is intentional because we don't wanna allow attacker to know which users exist in our database so that he can't
            narrow down his/her attacks on valid userIDs.
        */
    console.log(req.userData);
    if (req.params.userID != req.userData.userID)
      return res.status(401).json({ message: 'Authorization failed' });
    else next();
  } catch (error) {
    return res.status(401).json({ message: 'Authorization failed' });
  }
};
