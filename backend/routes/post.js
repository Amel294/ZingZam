const express = require('express');
const router = express.Router()
const { postPhoto } = require('../controllers/postController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
    }
});
const upload = multer({ storage: storage });

router.post('/uploadPhoto', upload.single('image') ,postPhoto);

module.exports = router;
