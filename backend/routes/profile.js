const express = require('express');
const { getProfile, updateName,updateUserName,addOrChangeBio } = require('../controllers/profileController');
const router = express.Router()

router.get('/:username',getProfile );
router.post("/update-name",updateName)
router.post("/update-username",updateUserName)
router.post("/add-or-change-bio",addOrChangeBio)

module.exports = router;
