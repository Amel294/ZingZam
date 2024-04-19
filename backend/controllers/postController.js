const { textToxicity } = require("../helpers/textToxicity");
const ConnectionsModel = require("../models/ConnectionsModel");
const SavedPostModel = require("../models/SavedPostModel");
const PostModel = require('../models/PostModel')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
const likesModel = require("../models/likesModel");
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

exports.getOwnPosts = async (req, res) => {
    try {
        const usersId = req?.userData?.id;
        const username = req.params.username;
        const page = parseInt(req.params.page) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;
        const posts = await PostModel.aggregate([
            {
                $match: { userId: usersId }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'commentUsers'
                }
            },
            {
                $addFields: {
                    'comments.username': { $arrayElemAt: ['$commentUsers.username', 0] },
                    'comments.picture': { $arrayElemAt: ['$commentUsers.picture', 0] },
                    'comments.userId': { $arrayElemAt: ['$commentUsers._id', 0] },
                    'user': { $arrayElemAt: ['$user', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    imageUrl: 1,
                    createdAt: 1,
                    comments: 1,
                    likes: 1,
                    likeCount: 1,
                    commentCount: 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.picture': 1,
                    'user.name': 1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
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
        // Query 1: Fetch posts from friends (if any)
        let posts = await PostModel.aggregate([
            { $match: { userId: { $in: friends } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'commentUsers'
                }
            },
            {
                $addFields: {
                    'comments.username': { $arrayElemAt: ['$commentUsers.username', 0] },
                    'comments.picture': { $arrayElemAt: ['$commentUsers.picture', 0] },
                    'comments.userId': { $arrayElemAt: ['$commentUsers._id', 0] },
                    'user': { $arrayElemAt: ['$user', 0] }
                }
            },
            {
                $addFields: {
                    'liked': {
                        $in: [userId, { $map: { input: '$likes', as: 'like', in: '$$like._id' } }] 
                    }
                }
            },
            {
                $lookup: { 
                    from: 'savedposts',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', userId] },
                                        { $in: ['$$postId', '$savedPost'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'saved'
                }
            },
            { $addFields: { saved: { $cond: { if: { $gt: [{ $size: '$saved' }, 0] }, then: true, else: false } } } }, 
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
        // Query 2: If no friend posts found, fetch public posts
        if (posts.length === 0) {
            posts = await PostModel.aggregate([
                { $match: { isPrivate: false } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'comments.userId',
                        foreignField: '_id',
                        as: 'commentUsers'
                    }
                },
                {
                    $addFields: {
                        'comments.username': { $arrayElemAt: ['$commentUsers.username', 0] },
                        'comments.picture': { $arrayElemAt: ['$commentUsers.picture', 0] },
                        'comments.userId': { $arrayElemAt: ['$commentUsers._id', 0] },
                        'user': { $arrayElemAt: ['$user', 0] }
                    }
                },
                {
                    $addFields: {
                        'liked': {
                            $in: [userId, { $map: { input: '$likes', as: 'like', in: '$$like._id' } }] 
                        }
                    }
                },
                {
                    $lookup: { 
                        from: 'savedposts',
                        let: { postId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$user', userId] },
                                            { $in: ['$$postId', '$savedPost'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'saved'
                    }
                },
                { $addFields: { saved: { $cond: { if: { $gt: [{ $size: '$saved' }, 0] }, then: true, else: false } } } }, 
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }
            ]);
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

exports.getPostsProfile = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const page = parseInt(req.params.page) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;
        const posts = await PostModel.aggregate([
            { $match: { userId: userId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'commentUsers'
                }
            },
            {
                $addFields: {
                    'comments.username': { $arrayElemAt: ['$commentUsers.username', 0] },
                    'comments.picture': { $arrayElemAt: ['$commentUsers.picture', 0] },
                    'comments.userId': { $arrayElemAt: ['$commentUsers._id', 0] },
                    'user': { $arrayElemAt: ['$user', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    imageUrl: 1,
                    createdAt: 1,
                    comments: 1,
                    likes: 1,
                    likeCount: 1,
                    commentCount: 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.picture': 1,
                    'user.name': 1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);
        console.log(posts)
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId, comment } = req.body;
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        post.comments.push({
            text: comment,
            userId: userId
        });
        await post.save();
        return res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
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
        
        // Find existing like document or create a new one if it doesn't exist
        let like = await likesModel.findOne({ postId });
        if (!like) {
            like = new likesModel({ postId, likedUsers: [] });
        }

        const userIdString = userId.toString();
        const isUserLiked = like.likedUsers.some(user => user.toString() === userIdString);

        if (isUserLiked) {
            like.likedUsers = like.likedUsers.filter(user => user.toString() !== userIdString);
        } else {
            like.likedUsers.push(userId);
        }

        await like.save();
        res.status(201).json({ message: isUserLiked ? 'Post unliked' : 'Post liked' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId, commentId } = req.params;
        const post = await PostModel.findById(postId);
        if (!post) {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postComments = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const { postId } = req.body;
        const post = await PostModel.findById(postId)
            .populate({
                path: 'comments.userId',
                select: 'picture',
            })
            .lean(); 
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const comments = post.comments.map(comment => {
            return {
                ...comment,
                userId: comment.userId._id, 
                picture: comment.userId.picture, 
            };
        });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
