const express = require('express');
const router = express.Router()
const { postPhoto,getPosts,addComment,getPostsProfile,saveUnsavePost,getOwnPosts,likeUnlikePost,postComments } = require('../controllers/postController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/uploadPhoto', upload.single('image') ,postPhoto);
router.get('/get-profile-posts/:username/:page',getOwnPosts);
router.get('/get-posts/:page',getPosts);
router.get('/get-posts-profile/:page',getPostsProfile);
router.post('/addcomment',addComment);
router.post('/saveunsave',saveUnsavePost);
router.post('/likeunlike',likeUnlikePost);
router.post('/get-comment-fromPostId',postComments)
module.exports = router;
