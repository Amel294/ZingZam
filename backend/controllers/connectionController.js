const mongoose = require('mongoose');
const UserModel = require("../models/UserModel");
const ConnectionsModel = require("../models/ConnectionsModel");
exports.getSuggestions = async (req, res) => {
    try {
        const id = req?.userData?.id;
        const userId = new mongoose.Types.ObjectId(id);
        const connections = await ConnectionsModel.findOne({ user: userId }, { requestsSend: 1, requestsReceived: 1, friends: 1, _id: 0 });
        let cantSuggest = [];
        if (connections) {
            const { requestsSend, requestsReceived, friends } = connections;
            cantSuggest = [...requestsSend, ...requestsReceived, ...friends, userId];
        }
        const suggestions = await UserModel.aggregate([
            { $match: { _id: { $nin: cantSuggest } } },
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 1 } },
        ]);
        res.status(200).json({ suggestions });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.sendRequest = async (req, res) => {
    try {
        const senderId = req?.userData?.id;
        const { receiverId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(receiverId)) return res.status(400).json({ error: 'Invalid receiver ID' })
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
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getRequestSend = async (req, res) => {
    try {
        const id = req?.userData?.id;
        const userId = new mongoose.Types.ObjectId(id);
        const requestSend = await ConnectionsModel.findOne(
            { user: userId },
            { requestsSend: 1, _id: 0 }
        ).populate('requestsSend', '_id name picture');
        if (!requestSend) return res.status(404).json({ message: "No requests found for this user" });
        res.status(200).json(requestSend);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteRequest = async (req, res) => {
    try {
        const senderId = req?.userData?.id
        const receiverId = req.params.receiverId;
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) return res.status(400).json({ message: 'Invalid senderId or receiverId' })
        const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
        const senderObjectId = new mongoose.Types.ObjectId(senderId);
        const senderExists = await ConnectionsModel.exists({
            user: senderObjectId,
            requestsSend: receiverObjectId
        });
        if (!senderExists) return res.status(400).json({ message: 'Friend request not found for sender' })
        const receiverExists = await ConnectionsModel.exists({
            user: receiverObjectId,
            requestsReceived: senderObjectId
        });
        if (!receiverExists) return res.status(400).json({ message: 'Friend request not found for receiver' })
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
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

exports.getRequestsReceived = async (req, res) => {
    try {
        const userId = req?.userData?.id;
        const requests = await ConnectionsModel.findOne({ user: userId }, { requestsReceived: 1, _id: 0 }).populate('requestsReceived', 'name username picture');
        if (!requests || !requests.requestsReceived || requests.requestsReceived.length === 0) return res.status(404).json({ error: "No requests found for the user." });
        return res.status(200).json({ requestsReceived: requests.requestsReceived });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.requestResponse = async (req, res) => {
    try {
        const { request, isAccept } = req.body;
        const userId = req?.userData?.id;
        const connection = await ConnectionsModel.findOne({ user: userId, requestsReceived: request });
        if (!connection) return res.status(404).json({ error: 'Request not found' })
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
        res.status(500).json({ error: 'Internal server error' });
    }
};
