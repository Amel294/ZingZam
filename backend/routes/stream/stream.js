const express = require('express');
const StreamModel = require('../../models/StreamModel');
const { generateStreamKey, deleteStreamKey,validateStreamKey, activateStream,deactivateStream,activateStreamers,activeStreams,getScreenshots,streamStatus,activeFriendsStreams,sendSupport } = require('../../controllers/stream/streamControlller');
const { accessTokenValidation } = require('../../helpers/accessTokenValidation');
const { isUserCheck } = require('../../helpers/isUserCheck');
const { isBlocked } = require('../../helpers/blockedCheck');
const router = express.Router();
router.post('/stream-keys-generate',accessTokenValidation,isUserCheck,isBlocked, generateStreamKey);
router.post('/stream-key-validate', validateStreamKey);
router.delete('/stream-key',accessTokenValidation,isUserCheck,isBlocked,deleteStreamKey)
router.patch('/activateStream',activateStream)
router.patch('/deactivateStream',deactivateStream)
router.get('/activeStreams',accessTokenValidation,isUserCheck,isBlocked,activeStreams)
router.get('/activeFriendsStreams',accessTokenValidation,isUserCheck,isBlocked,activeFriendsStreams)
router.get('/getScreenshots/:streamKey',getScreenshots)
router.get('/streamStatus/:streamKey',accessTokenValidation,isUserCheck,isBlocked,streamStatus)
router.post('/support',accessTokenValidation,isUserCheck,isBlocked,sendSupport)

module.exports = router;
