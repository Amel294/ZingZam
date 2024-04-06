const { getDataFromJWTCookie_id } = require("../helpers/dataFromJwtCookies");
const { textToxicity } = require("../helpers/textToxicity");
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
        // Decode JWT to access payload data
        const decodedPayload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

        // Access data from decoded payload
        const id = decodedPayload.id;
        console.log("From JWT ", id)
        // You can access other data from the payload as needed

        // Send response with payload data

        // Handle the uploaded file and caption here
        const caption = req.body.caption; // Contains the caption sent with the request
        const file = req.file; // Contains information about the uploaded file
        console.log(caption)
        // const testingToxicity = await textToxicity(caption)
        // for (const [category, value] of Object.entries(testingToxicity)) {
        //     // Check if the value exceeds the threshold of 0.5
        //     if (value > 0.5) {
        //         // If any value is above 0.5, send a response indicating that the post cannot be posted
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
            caption: caption
        })
        newPost.save()
        res.status(200).json({ posted: true, message: 'Image uploaded successfully.', file: file, caption: caption });
    } catch (error) {
        console.error('Error:', error);
        // Handle error here if needed
    }
}

exports.getPosts = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const id = getDataFromJWTCookie_id(res, jwtToken);

        const page = parseInt(req.params.page) || 1;
        const limit = 2;

        const skip = (page - 1) * limit;

        const posts = await PostModel.find({ userId: id })
            .populate({
                path: 'userId',
                select: '_id username picture name', // Specify the fields you want to populate
            })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ posts: posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};
