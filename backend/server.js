const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
// const multer = require('multer');
const morgan = require('morgan')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000; 
app.use(express.json());
// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));
app.use(morgan('dev'));

// app.use(cors());
// app.use(cors(options));
app.use(cookieParser())
// Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
//   }
// });
// const upload = multer({ storage: storage });

//routes
const UserRoute = require('./routes/user');
const PostRoute = require('./routes/post');
const adminRoutes = require('./routes/admin/userManagement')
const profileRoute = require('./routes/profile')
const connectionsRoute = require('./routes/connections');
const {accessTokenValidation,} = require('./helpers/accessTokenValidation')
app.use('/user', UserRoute)
app.use('/post',accessTokenValidation,PostRoute )
app.use('/admin',accessTokenValidation, adminRoutes)
app.use('/profile',accessTokenValidation, profileRoute)
app.use('/connections',accessTokenValidation,connectionsRoute)

mongoose.connect(process.env.DATABASE_URL_LOCAL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });
  const HOST = '10.4.2.248';
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//   app.listen(port, HOST, () => {
//     console.log(`Server is running on http://${HOST}:${port}`);
// });