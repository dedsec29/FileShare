// eslint-disable-next-line no-unused-vars
const uploadSchema = require('../models/uploads');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: '../uploads',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

function fileFilter(req, file, cb) {
  const fileTypes = '/jpeg|jpg|png/';
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error wrong format');
  }
}
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    fileFilter(file, cb);
  },
});

exports.uploaded = (req, res, next) => {
  upload.single('picture');
  next();
};

// eslint-disable-next-line no-unused-vars
exports.storedPicture = (req, res, next) => {
  //add database logic
  console.log('hii');
};
