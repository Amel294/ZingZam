const StreamChatModel = require('../models/StreamChat')

const addMessageToStreamChat = async (msg, room, senderId) => {
    try {
        await StreamChatModel.updateOne(
            { roomId: room },
            { $push: { messages: { senderId, text: msg } } },
            { upsert: true }
        );
        console.log(`Message saved to database: ${ msg }`);
    } catch (error) {
        console.error("Error saving message to database:", error);
    }
}
module.exports = addMessageToStreamChat;