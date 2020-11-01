const express = require('express');
const router = express.Router();
const storedPicture = require('../controllers/uploads');
const { upload } = require('../middleware/multer');
router.post('/uploads', upload.single('picture'), storedPicture);

module.exports = router;
