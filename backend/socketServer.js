const socketIo = require("socket.io");

function initializeSocketServer(server) {
    const io = socketIo(server, {
        cors: {
            origin: process.env.BASE_URL_FRONTEND,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        socket.on('join room', (streamKey) => {
            socket.join(streamKey);
            console.log(`A user joined room: ${streamKey}`);
        });

        socket.on("chat message", async ({ currentUserName,text, room, senderId }) => {
            const message = {currentUserName, text, room, senderId };
            io.to(room).emit("chat message", message);
            console.log(`Message sent to room ${room}: ${text}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}

module.exports = initializeSocketServer;
