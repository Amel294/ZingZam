const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const socketIo = require("socket.io");
require('dotenv').config();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.BASE_URL_FRONTEND,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
app.use(express.json());
app.use(cors({
  origin: process.env.BASE_URL_FRONTEND,
  credentials: true 
}));
app.use(morgan('dev'));
app.use(cookieParser())

//routes
const UserRoute = require('./routes/user');
const PostRoute = require('./routes/post');
const adminRoutes = require('./routes/admin/userManagement')
const profileRoute = require('./routes/profile')
const connectionsRoute = require('./routes/connections');
const reportRoute = require('./routes/reports');
const streamRoute = require('./routes/stream/stream')
const PaymentRoute = require('./routes/payment')
const {accessTokenValidation,} = require('./helpers/accessTokenValidation')
const {isBlocked} = require("./helpers/blockedCheck")
const {isUserCheck} = require("./helpers/isUserCheck");
const { adminTokenValidation } = require("./helpers/adminTokenValidation");
const { isAdminCheck } = require("./helpers/isAdminCheck");

app.use('/admin',adminTokenValidation,isAdminCheck, adminRoutes)
app.use('/user', UserRoute)
app.use('/post',accessTokenValidation,isUserCheck,isBlocked,PostRoute )
app.use('/profile',accessTokenValidation,isUserCheck,isBlocked, profileRoute)
app.use('/connections',accessTokenValidation,isUserCheck,isBlocked,connectionsRoute)
app.use('/report',reportRoute)
app.use('/stream',streamRoute)
app.use('/pay',accessTokenValidation,isUserCheck,isBlocked,PaymentRoute)

// Socket.io connection
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('join room', (streamKey) => {
        socket.join(streamKey);
        console.log(`A user joined room: ${streamKey}`);
    });

    socket.on("chat message", ({ msg, room }) => {
        io.to(room).emit("chat message", msg);
        console.log(`Message sent to room ${room}: ${msg}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

mongoose.connect(process.env.DATABASE_URL_LOCAL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Failed to connect to database:", err));

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
