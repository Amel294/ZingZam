const { textToxicity } = require("../helpers/textToxicity");
const ConnectionsModel = require("../models/ConnectionsModel");
const SavedPostModel = require("../models/SavedPostModel");
const PostModel = require('../models/PostModel')
const UserModel = require('../models/UserModel')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
const likesModel = require("../models/likesModel");
const CommentModel = require("../models/CommentModel");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.postPhoto = async (req, res) => {
    try {
        const id = req?.userData?.id;
        const username = req?.userData?.username;
        const caption = req.body.caption;
        const isPrivate = req.body.isPrivate;
        const file = req.file;
        const folderPath = `uploads/${ username }`;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const newPath = `${ folderPath }/${ file.filename }`;
        fs.renameSync(file.path, newPath);
        const result = await cloudinary.uploader.upload(newPath, {
            folder: `zingzam/posts/${ id }`
        });
        const newPost = new PostModel({
            userId: id,
            imageUrl: result.secure_url,
            username,
            caption: caption,
            isPrivate
        });
        await newPost.save();
        fs.unlinkSync(newPath);
        res.status(200).json({ posted: true, message: 'Image uploaded successfully.', file: file, caption: caption });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const id = req?.userData?.id;
        const userId = new mongoose.Types.ObjectId(id);
        const connections = await ConnectionsModel.findOne({ user: userId }, { friends: 1, _id: 0 });
        const friends = connections?.friends || [];
        const page = parseInt(req.params.page) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;

        let posts = await PostModel.aggregate([
            {
                $match: {
                    userId: { $in: [...friends, userId] },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$userId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                        { $project: { _id: 1, picture: 1, username: 1 } }
                    ],
                    as: 'postedBy'
                }
            },
            {
                $addFields: {
                    postedBy: { $arrayElemAt: ['$postedBy', 0] },
                    type: {
                        $cond: {
                            if: { $eq: ['$userId', userId] },
                            then: 'own',
                            else: 'friends'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likes: { $arrayElemAt: ['$likes', 0] },
                    likeCount: { $arrayElemAt: ['$likes.likeCount', 0] }
                }
            },
            {
                $addFields: {
                    userSaved: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ifNull: ['$savedPost', false] },
                                    { $not: { $eq: ['$savedPost', []] } }
                                ]
                            },
                            then: { $in: [userId, '$savedPost.savedPost'] },
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    imageUrl: 1,
                    caption: 1,
                    isPrivate: 1,
                    createdAt: 1,
                    postedBy: 1,
                    likeCount: 1,
                    userLiked: 1,
                    userSaved: 1,
                    type: 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        if (posts.length === 0) {
            posts = await PostModel.aggregate([
                {
                    $match: {
                        userId: { $nin: [...friends, userId] },
                        isPrivate: false
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { userId: '$userId' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                            { $project: { _id: 1, picture: 1, username: 1 } }
                        ],
                        as: 'postedBy'
                    }
                },
                {
                    $addFields: {
                        postedBy: { $arrayElemAt: ['$postedBy', 0] },
                        type: 'public'
                    }
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'postId',
                        as: 'likes'
                    }
                },
                {
                    $addFields: {
                        likes: { $arrayElemAt: ['$likes', 0] },
                        likeCount: { $arrayElemAt: ['$likes.likeCount', 0] }

                    }
                },
                {
                    $addFields: {
                        userSaved: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $ifNull: ['$savedPost', false] },
                                        { $not: { $eq: ['$savedPost', []] } }
                                    ]
                                },
                                then: { $in: [userId, '$savedPost.savedPost'] },
                                else: false
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        imageUrl: 1,
                        caption: 1,
                        isPrivate: 1,
                        createdAt: 1,
                        postedBy: 1,
                        likeCount: 1,
                        userLiked: 1,
                        userSaved: 1,
                        type: 1
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }
            ]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId, comment, parentCommentId } = req.body;
        let post = await CommentModel.findOne({ postId });
        if (!post) post = new CommentModel({ postId, comments: [] })
        if (parentCommentId) {
            const parentComment = post.comments.find(comment => comment._id.toString() === parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ error: 'Parent comment not found' });
            }
            parentComment.replies.push({
                text: comment,
                userId: userId
            });
        } else {
            post.comments.push({
                text: comment,
                userId: userId
            });
        }
        await post.save();
        return res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.saveUnsavePost = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId } = req.body;
        const savedPost = await SavedPostModel.findOne({ user: userId });
        if (!savedPost) {
            const newSavedPost = new SavedPostModel({
                user: userId,
                savedPost: [postId]
            });
            await newSavedPost.save();
            res.status(200).json({ saved: true, message: 'Post saved' });
        } else {
            const isPostSaved = savedPost.savedPost.includes(postId);
            if (isPostSaved) {
                savedPost.savedPost.pull(postId);
            } else {
                savedPost.savedPost.push(postId);
            }
            await savedPost.save();
            res.status(200).json({ saved: !isPostSaved, message: !isPostSaved ? 'Post saved' : 'Post unsaved' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.likeUnlikePost = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId } = req.body;
        let like = await likesModel.findOne({ postId });
        if (!like) {
            like = new likesModel({ postId, likedUsers: [] });
        } else {
        }
        let userLiked = false;
        const userIdString = userId.toString();
        const isUserLiked = like.likedUsers.some(user => user.toString() === userIdString);
        if (isUserLiked) {
            like.likedUsers = like.likedUsers.filter(user => user.toString() !== userIdString);
        } else {
            like.likedUsers.push(userId);
            userLiked = true;
        }
        await like.save();
        res.status(201).json({
            userLiked,
            newLikeCount: like.likeCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId, commentId } = req.params;
        console.log(req.params)
        const post = await CommentModel.findOne({postId:postId});
        if (!post) {
            console.error('Post not found:', postId); 
            return res.status(404).json({ error: 'Post not found' });
        }
        const commentIndex = post.comments.findIndex(comment => String(comment._id) === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (String(post.comments[commentIndex].userId) !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }
        post.comments.splice(commentIndex, 1);
        await post.save();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.commentsFromPostId = async (req, res) => {
    try {
        const { postId } = req.body;
        const comments = await CommentModel.findOne({ postId })
            .select('latestComments commentCount')
            .populate('latestComments.userId', '_id username name picture') 
            .lean();
        if (!comments || comments.latestComments.length === 0) {
            return res.status(404).json({ error: 'Latest comments not found' });
        }
        const formattedComments = comments.latestComments.map(comment => ({
            text: comment.text,
            userId: comment.userId._id, 
            createdAt: comment.createdAt,
            username: comment.userId.username,
            name: comment.userId.name,
            picture: comment.userId.picture || ''
        }));
        const commentCount = comments.commentCount;
        res.status(200).json({ latestComments: formattedComments, commentCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.LikedUsers = async (req, res) => {
    try {
        const postId = req.params.postId;
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 1;
        const skip = (page - 1) * limit;
        const like = await likesModel.findOne({ postId });
        if (!like) {
            return res.status(200).json({ likedUsers: [], totalLikes: 0 });
        }
        const likedUsersIds = like.likedUsers.slice(skip, skip + limit);
        if (likedUsersIds.length < 1) {
            return res.status(200).json({ isEnd: true, likedUsers: [], totalLikes: like.likedUsers.length });
        }
        const likedUsers = await UserModel.find({ _id: { $in: likedUsersIds } }, 'name username _id picture');
        res.status(200).json({ isEnd: false, likedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { postId, page = 1, limit = 2 } = req.params;
        const skip = (page - 1) * limit;
        const commentsData = await CommentModel.findOne({ postId })
            .select('comments commentCount')
            .lean()
            .populate({
                path: 'comments.userId',
                select: 'username name picture _id'
            })
            .sort({ 'comments.createdAt': -1 });

        if (!commentsData || !commentsData.comments || commentsData.comments.length === 0) {
            return res.status(200).json({ comments: [], totalComments: 0 });
        }

        const totalComments = commentsData.commentCount;

        const allFormattedComments = commentsData.comments.map(comment => ({
            ...comment._doc,
            text: comment.text,
            userId: comment.userId._id,
            username: comment.userId.username,
            name: comment.userId.name,
            picture: comment.userId.picture || '',
            createdAt: comment.createdAt,
            commentId: comment._id,
            hasReplies: commentsData.comments.some(c => c._id.equals(comment._id) && c.replies.length > 0)
        }));

        const formattedComments = allFormattedComments.slice(skip, skip + limit);

        return res.status(200).json({ comments: formattedComments, totalComments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

exports.getReplies = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await CommentModel.findOne({ 'comments._id': commentId })
            .select('comments.$')
            .populate({
                path: 'comments.replies.userId',
                select: 'username name picture _id'
            });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        const replies = comment.comments[0].replies;
        res.status(200).json(replies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch replies' });
    }
};