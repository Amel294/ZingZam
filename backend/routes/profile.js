const express = require('express');
const { getProfile, updateName } = require('../controllers/profileController');
const router = express.Router()

router.get('/:username',getProfile );
router.post("/update-name",updateName)

module.exports = router;
