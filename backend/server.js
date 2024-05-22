const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({
  origin: process.env.BASE_URL_FRONTEND,
  credentials: true 
}));
app.use(morgan('dev'));
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Failed to connect to database:", err));

const UserRoute = require('./routes/user');
const PostRoute = require('./routes/post');
const adminRoutes = require('./routes/admin/userManagement')
const profileRoute = require('./routes/profile')
const connectionsRoute = require('./routes/connections');
const reportRoute = require('./routes/reports');
const streamRoute = require('./routes/stream/stream')
const PaymentRoute = require('./routes/payment')
const { accessTokenValidation } = require('./helpers/accessTokenValidation');
const { isBlocked } = require("./helpers/blockedCheck");
const { isUserCheck } = require("./helpers/isUserCheck");
const { adminTokenValidation } = require("./helpers/adminTokenValidation");
const { isAdminCheck } = require("./helpers/isAdminCheck");

app.use('/admin', adminTokenValidation, isAdminCheck, adminRoutes);
app.use('/user', UserRoute);
app.use('/post', accessTokenValidation, isUserCheck, isBlocked, PostRoute);
app.use('/profile', accessTokenValidation, isUserCheck, isBlocked, profileRoute);
app.use('/connections', accessTokenValidation, isUserCheck, isBlocked, connectionsRoute);
app.use('/report', reportRoute);
app.use('/stream', streamRoute);
app.use('/pay', accessTokenValidation, isUserCheck, isBlocked, PaymentRoute);

const initializeSocketServer = require('./socketServer');
initializeSocketServer(server);

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
