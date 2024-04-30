const express = require('express');
const router = express.Router()
const { postPhoto,getPosts,addComment,saveUnsavePost,likeUnlikePost,commentsFromPostId,getIndividualPost,deleteComment, LikedUsers, getComments, getReplies,changeCaption, getProfilePosts  } = require('../controllers/postController');
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
router.get('/get-posts/:page',getPosts);
router.get('/get-Post/:postId', getIndividualPost);
router.get('/get-profile-posts/:username/:page',getProfilePosts);
router.post('/addcomment',addComment);
router.post('/saveunsave',saveUnsavePost);
router.post('/likeunlike',likeUnlikePost);
router.get('/get-comments/:postId/:page/:limit',getComments)
router.get('/replies/:commentId', getReplies);
router.delete('/comment/:postId/:commentId',deleteComment)
router.get("/liked-users/:postId/:page", LikedUsers)
router.put("/change-caption",changeCaption)
module.exports = router;
