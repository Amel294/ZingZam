const express = require('express');
const { userManagement, blockUnblock,blockUser } = require('../../controllers/admin/userManagement');
const userModel = require('../../models/UserModel')
const router = express.Router();
router.get("/usermanagement", userManagement);
router.post("/blockunblock/:userId",blockUnblock)
router.post("/block-user/:userId/:reportId",blockUser)
module.exports = router;
