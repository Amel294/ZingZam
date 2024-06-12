const express = require('express');
const { userManagement, blockUnblock,blockUser,stopAndBlockUser } = require('../../controllers/admin/userManagement');
const userModel = require('../../models/UserModel')
const router = express.Router();
router.get("/usermanagement", userManagement);
router.post("/blockunblock/:userId",blockUnblock)
router.post("/block-user/:userId/:reportId",blockUser)
router.post("/stop-stream-and-block-user/:userId/:reportId", stopAndBlockUser )
module.exports = router;
