const supportedRequests = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'].join(', '); //HTTPS requests we wanna allow for our API
//putting cors headers to prevent cors errors

module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      //because before requests like PUT and POST, browser always sends OPTIONS asking whether it can use those requests
      res.header('Access-Control-Allow-Methods', supportedRequests);
      return res.status(200).json({}); //approve 'okay'
    }
    //if we don't receive OPTIONS, continue to other requests
    next();
  }