const { default: mongoose } = require("mongoose");
const { generateAndSaveUniqueKey } = require("../../helpers/generateAndSaveUniqueKey");
const StreamModel = require("../../models/StreamModel");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ConnectionsModel = require("../../models/ConnectionsModel");
const ZingCoinsModel = require("../../models/ZingCoins");
const UserModel = require("../../models/UserModel");
const NotificationModel = require("../../models/NotificationModel");

exports.generateStreamKey = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req?.userData?.id);
        const title = req.body.title;
        await StreamModel.deleteMany({ userId: userId, streamEnd: { $exists: false } });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const requestCount = await StreamModel.countDocuments({
            userId: userId,
            createdAt: { $gte: today }
        });
        if (requestCount >= 10) {
            return res.status(429).json({ message: "API key request limit reached for today" });
        }
        const existingKey = await StreamModel.findOne({ userId: userId, title: title });
        if (existingKey) {
            return res.json({ streamKey: existingKey.streamKey, serverLink: process.env.RTMP_SERVER });
        } else {
            const newKey = await generateAndSaveUniqueKey(userId, title);
            return res.json({ streamKey: newKey, serverLink: process.env.RTMP_SERVER });
        }
    } catch (error) {
        res.status(500).json({ message: "Error generating stream key", error: error.message });
    }
}

exports.validateStreamKey = async (req, res) => {
    try {
        const { streamKey } = req.body
        const existingKey = await StreamModel.findOne({ streamKey: streamKey,streamEnd: { $exists: false } });
        console.log(existingKey)
        if (existingKey) {
            return res.status(200).json({ isValid: true })
        } else {
            return res.status(404).json({ isValid: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error validating stream key", error: error.message });
    }
}
exports.deleteStreamKey = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req?.userData?.id)

    let deletedCount = await StreamModel.deleteOne({ userId });

    if (deletedCount.number === 0) {
        return res.status(404).json({ message: "Stream key not found" });
    } else {
        return res.status(200).json({ message: "Stream key deleted successfully" });
    }
};

exports.activateStream = async (req, res) => {
    try {
        const { streamKey } = req.body;

        if (!streamKey) {
            return res.status(400).json({ error: 'Stream key is required' });
        }

        const stream = await StreamModel.findOneAndUpdate(
            { streamKey,streamEnd: { $exists: false } },
            { isActive: true, createdAt: new Date() },
            { new: true }
        );

        if (!stream) {
            return res.status(404).json({ error: 'Stream not found' });
        }

        if (!stream.userId) {
            return res.status(400).json({ error: 'Stream does not have a valid user' });
        }

        if (!stream.streamStart) {
            stream.streamStart = new Date();
            await stream.save();
        }

        const userId = stream.userId;
        const user = await UserModel.findById(userId);  // Ensure user is fetched from the database
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const connections = await ConnectionsModel.findOne({ user: userId }).populate('friends');
        let notifications = [];

        if (connections) {
            const friends = connections.friends;
            notifications = friends.map(friend => {
                const notification = new NotificationModel({
                    user: friend._id,
                    message: `${user.username} has started a stream.`,
                    data: { streamId: stream._id, userId: user._id, streamKey: stream.streamKey },
                });

                // Emit socket event to each friend
                const io = req.app.get('socketio');
                io.to(friend._id.toString()).emit('notification', {
                    message: notification.message,
                    streamId: stream._id,
                    userId: user._id,
                    streamKey: stream.streamKey
                });

                // Log the notification details
                console.log(`Notification sent from ${user.username} to ${friend.username}`);

                return notification.save();
            });
        }

        // Notify the streamer
        const streamerNotification = new NotificationModel({
            user: userId,
            message: 'Your stream has started.',
            data: { streamId: stream._id, userId: user._id, streamKey: stream.streamKey },
        });

        const io = req.app.get('socketio');
        io.to(userId.toString()).emit('notification', {
            message: streamerNotification.message,
            streamId: stream._id,
            userId: user._id,
            streamKey: stream.streamKey
        });

        // Log the notification details
        console.log(`Notification sent to ${user.username} (streamer)`);

        await Promise.all([...notifications, streamerNotification.save()]);

        res.status(200).json({ stream });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deactivateStream = async (req, res) => {
    try {
        const { streamKey } = req.body;
        const stream = await StreamModel.findOneAndUpdate(
            { streamKey },
            { isActive: false, streamEnd: new Date() },
            { new: true }
        )
        if (stream) {
            res.status(200).json({ message: 'Stream deactivated successfully', stream });
        } else {
            res.status(404).json({ message: 'Stream not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
};

exports.activeStreams = async (req, res) => {
    try {
        const response = await StreamModel.find({ isActive: true }).populate({
            path: 'userId',
            select: 'name username _id picture'
        });
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

exports.activeFriendsStreams = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req?.userData?.id);
        const connections = await ConnectionsModel.findOne({ user: userId }).populate('friends');
        if (!connections || !connections.friends.length) {
            return res.json([]);
        }
        const activeStreams = await StreamModel.find({
            userId: { $in: connections.friends.map(friend => friend._id) },
            isActive: true
        }).populate({
            path: 'userId',
            select: 'name username _id picture'
        });
        res.json(activeStreams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

async function captureScreenshot(streamUrl, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(streamUrl)
            .on('end', () => {
                console.log('Screenshot captured');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error capturing screenshot:', err);
                reject(err);
            })
            .screenshots({
                count: 1,
                folder: path.dirname(outputPath),
                filename: path.basename(outputPath),
                size: '320x240'
            });
    });
}

exports.getScreenshots = async (req, res) => {
    console.log("Getting screenshot")
    const streamKey = req.params.streamKey;
    const streamUrl = `${ process.env.BASE_URL_STREAM }/live/${ streamKey }.flv`;
    const outputPath = `./screenshots/screenshot-${ streamKey }.png`;
    console.log(streamKey)
    try {
        await captureScreenshot(streamUrl, outputPath);
        const screenshotData = fs.readFileSync(outputPath);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(screenshotData, 'binary');
        fs.unlinkSync(outputPath);
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).send('Error capturing screenshot');
    }
}

exports.streamStatus = async (req, res) => {
    try {
        const { streamKey } = req.params
        console.log(streamKey)

        const stream = await StreamModel.findOne({ streamKey });
        if (!stream) {
            return res.json({ status: 'notfound', userId: stream.userId });
        }
        if (stream.isActive === false) {
            return res.json({ status: 'inactive', userId: stream.userId });
        } else {
            return res.json({ status: 'active', userId: stream.userId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting streamstatus');
    }
}

exports.sendSupport = async (req, res) => {
    try {
        const senderId = new mongoose.Types.ObjectId(req?.userData?.id);
        let { coins, message, streamKey } = req.body;

        coins = Number(coins);
        if (coins <= 0) {
            return res.status(500).send({ message: "0 Zing Coins" });
        }
        const sender = await ZingCoinsModel.findOne({ userId: senderId });
        if (!sender || sender.coins < coins) {
            return res.status(500).send({ message: "Insufficient Zing Coins" });
        }
        const stream = await StreamModel.findOne({ streamKey });
        if (!stream) {
            throw new Error('Stream not found');
        }
        const recipientId = stream.userId;
        const senderUpdate = ZingCoinsModel.updateOne(
            { userId: senderId },
            {
                $inc: { coins: -coins },
                $push: {
                    support: {
                        streamId: stream._id,
                        user: recipientId,
                        coins: coins,
                        transactionType: 'Send',
                        timestamp: new Date()
                    }
                }
            }
        );

        const recipientUpdate = ZingCoinsModel.updateOne(
            { userId: recipientId },
            {
                $inc: { coins: coins },
                $push: {
                    support: {
                        user: senderId,
                        coins: coins,
                        transactionType: 'Received',
                        timestamp: new Date()
                    }
                }
            },
            { upsert: true }
        );

        const streamUpdate = StreamModel.updateOne(
            { _id: stream._id },
            {
                $push: {
                    supportReceived: {
                        user: senderId,
                        coins: coins,
                        message: message,
                        timestamp: new Date()
                    }
                }
            }
        );

        await Promise.all([senderUpdate, recipientUpdate, streamUpdate]);

        const updatedSender = await ZingCoinsModel.findOne({ userId: senderId });

        const io = req.app.get('socketio');
        io.to(streamKey).emit('gift received', {
            senderId,
            recipientId,
            coins,
            message,
            streamKey
        });

        res.status(200).send({ ZingBalance: updatedSender.coins });
    } catch (error) {
        console.error(error);
        res.status(500).send(`message: ${ error.message }`);
    }
};

exports.getSupporters = async (req, res) => {
    try {
        const { streamKey } = req.params;
        const stream = await StreamModel.findOne({ streamKey }).populate('supportReceived.user', '_id name username');
        if (!stream) {
            return res.status(404).json({ status: 'notfound', streamKey });
        }

        const supportMap = new Map();
        stream.supportReceived.forEach(support => {
            const userId = support.user._id.toString();
            if (!supportMap.has(userId)) {
                supportMap.set(userId, {
                    user: {
                        _id: support.user._id,
                        name: support.user.name,
                        username: support.user.username
                    },
                    coins: 0,
                    messages: []
                });
            }
            const userSupport = supportMap.get(userId);
            userSupport.coins += support.coins;
            userSupport.messages.push(support.message);
        });

        const aggregatedSupport = Array.from(supportMap.values())
            .sort((a, b) => b.coins - a.coins)
            .slice(0, 3);

        return res.status(200).json({ support: aggregatedSupport });
    } catch (error) {
        console.error('Error in getSupporters:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.getUserStreams = async (req, res) => {
    try {
        const { page } = req.params;
        const userId = req.userData.id;
        const perPage = 1;
        const streams = await StreamModel.find({ userId: userId })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('userId', 'username')
            .populate('supportReceived.user', 'username')
            .exec();

        const totalStreams = await StreamModel.countDocuments({ userId: userId });
        const hasMore = (page * perPage) < totalStreams;

        const responseData = streams.map(stream => {
            const topContributors = stream.supportReceived
                .reduce((acc, support) => {
                    const existing = acc.find(item => item.user.username === support.user.username);
                    if (existing) {
                        existing.coins += support.coins;
                    } else {
                        acc.push({ user: support.user, coins: support.coins });
                    }
                    return acc;
                }, [])
                .sort((a, b) => b.coins - a.coins)
                .slice(0, 3);

            return {
                streamId: stream._id,
                title: stream.title,
                startTime: stream.streamStart,
                endTime: stream.streamEnd,
                contributionsReceived: stream.supportReceived.length,
                topContributors: topContributors.map(contributor => ({
                    username: contributor.user.username,
                    coins: contributor.coins
                }))
            };
        });

        res.status(200).json({ streams: responseData, hasMore });
    } catch (error) {
        console.error('Error fetching stream data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
