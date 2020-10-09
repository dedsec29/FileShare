// eslint-disable-next-line no-unused-vars
const Upload = require('../models/uploads');
function storedPicture(req, res) {
  //add database logic

  const image = new Upload({
    name: req.body.name,
    picture: req.file.path,
  });
  image
    .save()
    .then((results) => {
      //sending appropriate status
      console.log(results);
      res.status(201).json({
        message: 'Handling POST requests to /uploads/',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}
module.exports = storedPicture;
