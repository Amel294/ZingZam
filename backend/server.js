const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: [process.env.BASE_URL_FRONTEND, process.env.BASE_URL_DOMAIN],
    credentials: true
}));
app.use(morgan('dev'));
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Failed to connect to database:", err));

const UserRoute = require('./routes/user');
const PostRoute = require('./routes/post');
const adminRoutes = require('./routes/admin/userManagement');
const profileRoute = require('./routes/profile');
const connectionsRoute = require('./routes/connections');
const reportRoute = require('./routes/reports');
const streamRoute = require('./routes/stream/stream');
const PaymentRoute = require('./routes/payment');
const { accessTokenValidation } = require('./helpers/accessTokenValidation');
const { isBlocked } = require("./helpers/blockedCheck");
const { isUserCheck } = require("./helpers/isUserCheck");
const { adminTokenValidation } = require("./helpers/adminTokenValidation");
const { isAdminCheck } = require("./helpers/isAdminCheck");

app.use('/api/admin', adminTokenValidation, isAdminCheck, adminRoutes);
app.use('/api/user', UserRoute);
app.use('/api/post', accessTokenValidation, isUserCheck, isBlocked, PostRoute);
app.use('/api/profile', accessTokenValidation, isUserCheck, isBlocked, profileRoute);
app.use('/api/connections', accessTokenValidation, isUserCheck, isBlocked, connectionsRoute);
app.use('/api/report', reportRoute);
app.use('/api/stream', streamRoute);
app.use('/api/pay', accessTokenValidation, isUserCheck, isBlocked, PaymentRoute);

const initializeSocketServer = require('./socketServer');
initializeSocketServer(server, app);

const Notification = require('./models/NotificationModel');
const Connections = require('./models/ConnectionsModel');

async function notifyFriendsStreamStart(userId, streamKey) {
    try {
        const userConnections = await Connections.findOne({ user: userId }).populate('friends').exec();
        if (userConnections && userConnections.friends.length > 0) {
            userConnections.friends.forEach(async (friend) => {
                // Emit to currently connected users
                const io = app.get('socketio');
                io.to(friend._id.toString()).emit('friend stream started', { streamKey });

                // Store notification in the database
                const notification = new Notification({
                    user: friend._id,
                    message: `Your friend started a stream: ${streamKey}`,
                    data: { streamKey },
                });
                await notification.save();
            });
        }
    } catch (error) {
        console.error('Error notifying friends:', error);
    }
}

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

app.use(express.static(buildPath));

app.get("/*", function (req, res) {
    res.sendFile(
        path.join(__dirname, "../frontend/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
