const { default: mongoose } = require("mongoose");
const { generateAndSaveUniqueKey } = require("../../helpers/generateAndSaveUniqueKey");
const StreamModel = require("../../models/StreamModel");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ConnectionsModel = require("../../models/ConnectionsModel");
const ZingCoinsModel= require("../../models/ZingCoins")
exports.generateStreamKey = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req?.userData?.id);
        const title = req.body.title;
        await StreamModel.deleteMany({ userId: userId, title: { $ne: title } });
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
        const existingKey = await StreamModel.findOne({ streamKey: streamKey });
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
        const stream = await StreamModel.findOneAndUpdate(
            { streamKey },
            { isActive: true },
            { new: true }
        )
        if (stream) {
            res.status(200).json({ message: 'Stream activated successfully', stream });
        } else {
            res.status(404).json({ message: 'Stream not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.deactivateStream = async (req, res) => {
    try {
        const { streamKey } = req.body;
        const stream = await StreamModel.findOneAndUpdate(
            { streamKey },
            { isActive: false },
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
    const streamUrl = `http://localhost:7000/live/${ streamKey }.flv`;
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
        console.log("In stream status")
        const { streamKey } = req.params
        console.log(streamKey)

        const stream = await StreamModel.findOne({ streamKey });
        if (!stream) {
            return res.json({ status: 'notfound' ,userId : stream.userId });
        }
        if (stream.isActive === false) {
            return res.json({ status: 'inactive',userId : stream.userId });
        } else {
            return res.json({ status: 'active',userId : stream.userId });
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
            throw new Error('coins must be greater than zero');
        }
        const sender = await ZingCoinsModel.findOne({ userId: senderId });
        if (!sender || sender.coins < coins) {
            throw new Error('Insufficient Zing Coins');
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
            }
        );

        const streamUpdate = StreamModel.updateOne(
            { _id: stream._id },
            {
                $push: {
                    supportReceived: {
                        user: senderId,
                        coins: coins,
                        message:message,
                        timestamp: new Date()
                    }
                }
            }
        );

        await Promise.all([senderUpdate, recipientUpdate, streamUpdate]);

        res.status(200).send('Support sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error sending support: ${error.message}`);
    }
};