const express = require('express');
const { getProfile, updateName,updateUserName } = require('../controllers/profileController');
const router = express.Router()

router.get('/:username',getProfile );
router.post("/update-name",updateName)
router.post("/update-username",updateUserName)

module.exports = router;
