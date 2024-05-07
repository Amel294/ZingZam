const express = require('express');
const StreamModel = require('../../models/StreamModel');
const { generateStreamKey, deleteStreamKey,validateStreamKey } = require('../../controllers/stream/streamControlller');
const { accessTokenValidation } = require('../../helpers/accessTokenValidation');
const { isUserCheck } = require('../../helpers/isUserCheck');
const { isBlocked } = require('../../helpers/blockedCheck');
const router = express.Router();
router.post('/stream-keys-generate',accessTokenValidation,isUserCheck,isBlocked, generateStreamKey);
router.post('/stream-key-validate', validateStreamKey);
router.delete('/stream-key',accessTokenValidation,isUserCheck,isBlocked,deleteStreamKey)
module.exports = router;
