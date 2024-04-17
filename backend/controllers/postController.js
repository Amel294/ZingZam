const { getDataFromJWTCookie_id } = require("../helpers/dataFromJwtCookies");
const { textToxicity } = require("../helpers/textToxicity");
const ConnectionsModel = require("../models/ConnectionsModel");
const SavedPostModel = require("../models/SavedPostModel");
const PostModel = require('../models/PostModel')
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.postPhoto = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;

        if (!jwtToken) {
            return res.status(401).json({ message: "JWT not found in cookie" });
        }
        console.log("you have and access token")
        console.log(jwtToken)
        const decodedPayload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

        const id = decodedPayload.id;
        console.log("From JWT ", id)

        const caption = req.body.caption;
        const isPrivate = req.body.isPrivate;
        const file = req.file;

        // const testingToxicity = await textToxicity(caption)
        // for (const [category, value] of Object.entries(testingToxicity)) {
        //     if (value > 0.5) {
        //         return res.status(200).json({ posted: false, message: `Cannot be posted.Your post is identified as ${ category }` });
        //     }
        // }
        // console.log(testingToxicity)
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "zingzam/posts/660bec6ae609cf875fd1e70b" // Specify the folder name here
        });

        console.log(result)
        const newPost = new PostModel({
            userId: id,
            imageUrl: result.secure_url,
            username: decodedPayload.username,
            caption: caption,
            isPrivate
        })
        newPost.save()
        res.status(200).json({ posted: true, message: 'Image uploaded successfully.', file: file, caption: caption });
    } catch (error) {
        console.error('Error:', error);
    }
}

exports.getOwnPosts = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const usersId = getDataFromJWTCookie_id(res, jwtToken);

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
        console.log(typeof id);
        if (!id) {
            throw new Error('User ID not found in request');
        }
        const userId = new mongoose.Types.ObjectId(id); // Convert userId to ObjectID
        console.log("User id from JWT Token is", userId)
        
        const connections = await ConnectionsModel.findOne({ user: userId }, { friends: 1, _id: 0 });
        console.log(connections)
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
                        $in: [userId, { $map: { input: '$likes', as: 'like', in: '$$like._id' } }] // Updated $in with ObjectID conversion
                    }
                }
            },
            { $lookup: { // populate saved posts
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
            }},
            { $addFields: { saved: { $cond: { if: { $gt: [{ $size: '$saved' }, 0] }, then: true, else: false } } } }, // add saved field indicating whether the post is saved by the user
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
                            $in: [userId, { $map: { input: '$likes', as: 'like', in: '$$like._id' } }] // Updated $in with ObjectID conversion
                        }
                    }
                },
                { $lookup: { // populate saved posts
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
                }},
                { $addFields: { saved: { $cond: { if: { $gt: [{ $size: '$saved' }, 0] }, then: true, else: false } } } }, // add saved field indicating whether the post is saved by the user
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }
            ]);
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

exports.getPostsProfile = async (req, res) => {
    try {
        
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);

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
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
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
        console.error('Error adding comment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.saveUnsavePost = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
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
        console.error('Error saving/unsaving post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.likeUnlikePost = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        const { postId } = req.body;
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const userIdString = userId.toString(); // Convert userId to string
        const isPostLiked = post.likes.some(like => like._id.toString() === userIdString);
        if (isPostLiked) {
            post.likes = post.likes.filter(like => like._id.toString() !== userIdString);
        } else {
            post.likes.push({ _id: userId }); // Push userId as an object
        }
        await post.save();
        res.status(201).json({ message: !isPostLiked ? 'Post liked' : 'Post unliked' });
    } catch (err) {
        console.error('Error liking/unliking post:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        const { postId, commentId } = req.params; // Access postId and commentId from req.params

        // Find the post by postId
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Find the index of the comment to delete
        const commentIndex = post.comments.findIndex(comment => String(comment._id) === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the comment belongs to the user
        if (String(post.comments[commentIndex].userId) !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        // Remove the comment from the comments array
        post.comments.splice(commentIndex, 1);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postComments = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        const { postId } = req.body;
        
        // Find the post by postId and populate the comments' userId field
        const post = await PostModel.findById(postId)
            .populate({
                path: 'comments.userId',
                select: 'picture',
            })
            .lean(); // Use lean() to convert Mongoose documents into plain JavaScript objects
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        // Iterate over the comments array to modify userId field
        const comments = post.comments.map(comment => {
            return {
                ...comment,
                userId: comment.userId._id, // Use only the ObjectId
                picture: comment.userId.picture, // Add the picture field to comments
            };
        });
        
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error getting new comments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
