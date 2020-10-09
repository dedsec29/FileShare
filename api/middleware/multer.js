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

function fileFilter(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
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

module.exports = { upload, storage, fileFilter };
