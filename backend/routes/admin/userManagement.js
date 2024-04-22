const express = require('express');
const { userManagement, blockUnblock } = require('../../controllers/admin/userManagement');
const userModel = require('../../models/UserModel')
const router = express.Router();
router.get("/usermanagement", userManagement);
router.post("/blockunblock/:userId",blockUnblock)
module.exports = router;
