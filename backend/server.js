const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const multer = require('multer');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000; 
console.log(port);
app.use(express.json());
// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));
// app.use(cors());
// app.use(cors(options));
app.use(cookieParser())
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
  }
});
const upload = multer({ storage: storage });

//routes
const UserRoute = require('./routes/user');
const ApiRoute = require('./routes/api');
const PostRoute = require('./routes/post');
const adminRoutes = require('./routes/admin/userManagement')
const profileRoute = require('./routes/profile')
const connectionsRoute = require('./routes/connections')
app.use((err, req, res, next) => { // Catch unhandled errors
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.use('/user', UserRoute)
app.use('/api', ApiRoute)
app.use('/post',PostRoute )
app.use('/admin', adminRoutes)
app.use('/profile', profileRoute)
app.use('/connections',connectionsRoute)

mongoose.connect(process.env.DATABASE_URL_LOCAL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
