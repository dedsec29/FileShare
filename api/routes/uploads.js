const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploads');
const uploadSchema = require('../models/uploads');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('picture'), (req, res, next) => {
  console.log('hi');
});

module.exports = router;
