const express = require('express');
const router = express.Router()
const { postPhoto,getPosts,addComment,getPostsProfile,saveUnsavePost } = require('../controllers/postController');
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
router.get('/get-posts/:page',getPosts);
router.get('/get-posts-profile/:page',getPostsProfile);
router.post('/addcomment',addComment);
router.post('/saveunsave',saveUnsavePost);

module.exports = router;
