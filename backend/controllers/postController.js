const { getDataFromJWTCookie_id } = require("../helpers/dataFromJwtCookies");
const { textToxicity } = require("../helpers/textToxicity");
const ConnectionsModel = require("../models/ConnectionsModel");
const SavedPostModel = require("../models/SavedPostModel");
const PostModel = require('../models/PostModel')
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

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
        const file = req.file;
        console.log(caption)
        const testingToxicity = await textToxicity(caption)
        for (const [category, value] of Object.entries(testingToxicity)) {
            // Check if the value exceeds the threshold of 0.5
            if (value > 0.5) {
                // If any value is above 0.5, send a response indicating that the post cannot be posted
                return res.status(200).json({ posted: false, message: `Cannot be posted.Your post is identified as ${ category }` });
            }
        }
        console.log(testingToxicity)
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "zingzam/posts/660bec6ae609cf875fd1e70b" // Specify the folder name here
        });

        console.log(result)
        const newPost = new PostModel({
            userId: id,
            imageUrl: result.secure_url,
            username: decodedPayload.username,
            caption: caption
        })
        newPost.save()
        res.status(200).json({ posted: true, message: 'Image uploaded successfully.', file: file, caption: caption });
    } catch (error) {
        console.error('Error:', error);
    }
}

exports.getPosts = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);

        // Get friends' IDs
        const connections = await ConnectionsModel.findOne({ user: userId }, { friends: 1, _id: 0 });
        const friends = connections?.friends || [];
        friends.push(userId); 
        console.log("friends")
        console.log(friends)

        const page = parseInt(req.params.page) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;

        // Aggregation Pipeline
        const posts = await PostModel.aggregate([
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
                    'comments.userId': { $arrayElemAt: ['$commentUsers._id', 0] }, // Include userId of the comment maker
                    'user': { $arrayElemAt: ['$user', 0] } // Include data of the post creator
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
exports.getPostsProfile = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);

        const page = parseInt(req.params.page) || 1;                          
        const limit = 2;
        const skip = (page - 1) * limit;

        // Aggregation Pipeline
        const posts = await PostModel.aggregate([
            { $match: { userId: userId } }, // Filter posts by userId
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
                    'comments.userId': { $arrayElemAt: ['$commentUsers._id', 0] }, // Include userId of the comment maker
                    'user': { $arrayElemAt: ['$user', 0] } // Include data of the post creator
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
            res.status(200).json({ saved : true ,message: 'Post saved' });
        } else {
            const isPostSaved = savedPost.savedPost.includes(postId); 
            if (isPostSaved) {
                savedPost.savedPost.pull(postId); // Remove if already saved
            } else {
                savedPost.savedPost.push(postId); // Add if not yet saved
            }
            await savedPost.save();

            // Updated response for frontend clarity
            res.status(200).json({ saved: !isPostSaved, message: !isPostSaved ? 'Post saved' : 'Post unsaved' }); 
        }
    } catch (error) {
        console.error('Error saving/unsaving post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
