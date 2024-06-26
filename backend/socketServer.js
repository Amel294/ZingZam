const socketIo = require("socket.io");
const Notification = require('./models/NotificationModel'); // Adjust the path

function initializeSocketServer(server, app) {
    const io = socketIo(server, {
        cors: {
            origin: [process.env.BASE_URL_FRONTEND, process.env.BASE_URL_DOMAIN],
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    app.set('socketio', io);

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId);
            console.log("User connected for notification " + userId)
            try {
                const notifications = await Notification.find({ user: userId, isRead: false }).exec();
                notifications.forEach(notification => {
                    socket.emit('notification', {
                        message: notification.message,
                        streamKey: notification.data.streamKey, 
                        data: notification.data,
                    });
                    notification.isRead = true;
                    notification.save();
                });
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }

        socket.on('join room', (streamKey) => {
            socket.join(streamKey);
            console.log(`A user joined room: ${streamKey}`);
        });

        socket.on("chat message", async ({ currentUserName, text, room, senderId }) => {
            const message = { currentUserName, text, room, senderId };
            io.to(room).emit("chat message", message);
            console.log(`Message sent to room ${room}: ${text}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}

module.exports = initializeSocketServer;
