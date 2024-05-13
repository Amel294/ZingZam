const socketIo = require("socket.io");
const addMessageToStreamChat = require("./socketHelper/addMessageToStreamChat");
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
      console.log(`A user joined room: ${ streamKey }`);
    });

    socket.on("chat message", async ({ msg, room, senderId }) => {
      addMessageToStreamChat(msg,room,senderId)
      io.to(room).emit("chat message", msg);
      console.log(`Message sent to room ${ room }: ${ msg }`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}
module.exports = initializeSocketServer
