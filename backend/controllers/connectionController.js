const { getDataFromJWTCookie_id } = require("../helpers/dataFromJwtCookies");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require("../models/UserModel");
const ConnectionsModel = require("../models/ConnectionsModel");
exports.getSuggestions = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = new mongoose.Types.ObjectId(getDataFromJWTCookie_id(res, jwtToken));
        console.log(userId)
        const connections = await ConnectionsModel.findOne({ user: userId }, { requests: 1, friends: 1, _id: 0 });
        let cantSuggest = [];
        let requests = [];
        let friends = [];
        if (connections) {
            requests = connections?.requests || [];
            friends = connections?.friends || [];
            cantSuggest = [...requests, ...friends, userId];
        }
        const suggestions = await UserModel.aggregate([
            { $match: { _id: { $nin: cantSuggest } } },
            { $sample: { size: 1 } },
        ]);
        res.status(200).json({ suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.sendRequest = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const senderId = getDataFromJWTCookie_id(res, jwtToken); 
        const { receiverId } = req.body; 
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: 'Invalid receiver ID' });
        }
        let senderConnections = await ConnectionsModel.findOne({ user: senderId });
        if (!senderConnections) {
            senderConnections = new ConnectionsModel({
                user: senderId,
                friends: [],
                requestsSend: [],
                requestsReceived: []
            });
        }
        if (!senderConnections.requestsSend.includes(receiverId)) {
            senderConnections.requestsSend.push(receiverId);
            await senderConnections.save();
        }
        let receiverConnections = await ConnectionsModel.findOne({ user: receiverId });
        if (!receiverConnections) {
            receiverConnections = new ConnectionsModel({
                user: receiverId,
                friends: [],
                requestsSend: [],
                requestsReceived: []
            });
        }
        if (!receiverConnections.requestsReceived.includes(senderId)) {
            receiverConnections.requestsReceived.push(senderId);
            await receiverConnections.save();
        }
        return res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error handling friend request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getRequestSend = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = new mongoose.Types.ObjectId(getDataFromJWTCookie_id(res, jwtToken));
        const requestSend = await ConnectionsModel.findOne(
            { user: userId },
            { requestsSend: 1, _id: 0 } 
        ).populate('requestsSend', '_id name picture');
        if (!requestSend) {
            return res.status(404).json({ message: "No requests found for this user" });
        }
        res.status(200).json(requestSend);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteRequest = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const senderId = getDataFromJWTCookie_id(res, jwtToken); 
        const  receiverId  = req.params.receiverId;
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: 'Invalid senderId or receiverId' });
        }
        const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
        const senderObjectId = new mongoose.Types.ObjectId(senderId); 
        const senderExists = await ConnectionsModel.exists({
            user: senderObjectId,
            requestsSend: receiverObjectId
        });
        if (!senderExists) {
            return res.status(400).json({ message: 'Friend request not found for sender' });
        }
        const receiverExists = await ConnectionsModel.exists({
            user: receiverObjectId,
            requestsReceived: senderObjectId
        });
        if (!receiverExists) {
            return res.status(400).json({ message: 'Friend request not found for receiver' });
        }
        await ConnectionsModel.findOneAndUpdate(
            { user: senderObjectId },
            { $pull: { requestsSend: receiverObjectId } }
        );
        await ConnectionsModel.findOneAndUpdate(
            { user: receiverObjectId },
            { $pull: { requestsReceived: senderObjectId } }
        );
        res.status(200).json({ message: 'Friend request deleted successfully' });
    } catch (error) {
        console.error('Error deleting friend request:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

exports.getRequestsReceived = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        const requests = await ConnectionsModel.findOne({ user: userId }, { requestsReceived: 1, _id: 0 }).populate('requestsReceived', 'name username picture');
        console.log("requests received")
        console.log(requests)
        return res.status(200).json({ requestsReceived: requests.requestsReceived });
    } catch (error) {

    }
}
exports.requestResponse = async (req, res) => {
    try {
        const { request, isAccept } = req.body;
        const jwtToken = req?.cookies?.accessToken;
        const userId = getDataFromJWTCookie_id(res, jwtToken);
        const connection = await ConnectionsModel.findOne({ user: userId, requestsReceived: request });
        if (!connection) {
            return res.status(404).json({ error: 'Request not found' });
        }
        if (isAccept) {
            await ConnectionsModel.findOneAndUpdate(
                { user: userId },
                { $push: { friends: connection.requestsReceived } }
            );
            await ConnectionsModel.findOneAndUpdate(
                { user: connection.requestsReceived },
                { $push: { friends: userId } }
            );
        }
        await ConnectionsModel.findOneAndUpdate(
            { user: userId },
            { $pull: { requestsReceived: request } }
        );
        await ConnectionsModel.findOneAndUpdate(
            { user: connection.requestsReceived },
            { $pull: { requestsSend: userId } }
        );
        return res.status(200).json({ message: isAccept ? 'Friend request accepted!' : 'Friend request declined' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
