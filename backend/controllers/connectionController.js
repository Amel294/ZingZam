const { getDataFromJWTCookie_id } = require("../helpers/dataFromJwtCookies");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require("../models/UserModel");
const ConnectionsModel = require("../models/ConnectionsModel");
const { ObjectId } = require('mongoose').Types;

exports.getSuggestions = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = new ObjectId(getDataFromJWTCookie_id(res, jwtToken));
        console.log(userId)
        const connections = await ConnectionsModel.findOne({ user: userId }, { requests: 1, friends: 1, _id: 0 });
        let cantSuggest = [];
        let requests = [];
        let friends = [];
        // Check if connections are found
        if (connections) {
            requests = connections?.requests || [];
            friends = connections?.friends || [];
            cantSuggest = [...requests, ...friends, userId];
        }
       
        const suggestions = await UserModel.aggregate([
            { $match: { _id: { $nin: cantSuggest } } }, 
            { $sample: { size: 1 } }, 
        ]);

        console.log(suggestions);

        res.status(200).json({ suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.requestHandle = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        let connections = await ConnectionsModel.findOne({ user: userId });
        if (!connections) {
            connections = new ConnectionsModel({
                user: userId,
                requests: []
            });
        }
        const { request } = req.body;
        const index = connections.requests.indexOf(request);
        if (index !== -1) {
            connections.requests.splice(index, 1);
            await connections.save();
            return res.status(200).json({ message: 'Friend request removed successfully' });
        } else {
            connections.requests.push(request);
            await connections.save();
            return res.status(200).json({ message: 'Friend request sent successfully' });
        }
    } catch (error) {
        console.error('Error handling friend request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getRequests = async (req,res ) =>{
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        const requests = await ConnectionsModel.findOne({ user: userId }, { requests: 1, _id: 0 }).populate('requests', 'name username picture');
        return res.status(200).json({ requests:requests.requests });
    } catch (error) {
        
    }
}
exports.requestResponse = async (req, res) => {
    try {
        console.log(req.body)
        const { request, isAccept } = req.body;
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);

        const connection = await ConnectionsModel.findOneAndUpdate(
            { user: userId, requests: request }, 
            {  
                ...(isAccept ? 
                        { $push: { friends: request }, $pull: { requests: request } } : 
                        { $pull: { requests: request } } 
                )
            },
            { new: true } 
        ); 

        if (!connection) {
            return res.status(404).json({ error: 'Request not found' });
        }
        console.log(isAccept)
        res.status(200).json({ message: isAccept ? 'Friend request accepted!' : 'Friend request declined' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
