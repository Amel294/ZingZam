const express = require('express');
const { userManagement } = require('../../controllers/admin/userManagement');
const userModel = require('../../models/UserModel')
const router = express.Router();
router.get("/usermanagement", userManagement);
    
module.exports = router;
