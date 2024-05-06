const express = require('express');
const { getSuggestions,sendRequest,requestResponse,getRequestsReceived, deleteRequest,getRequestSend, searchUser,fetchFriends } = require('../controllers/connectionController');
const router = express.Router();
router.get('/suggestions', getSuggestions);
router.post('/sendrequest', sendRequest);
router.delete('/deleterequest/:receiverId', deleteRequest);
router.get('/getrequestsend' ,  getRequestSend) ;
router.get('/getrequestsreceived',getRequestsReceived)
router.post('/requestResponse', requestResponse);
router.get('/search-users',searchUser)
router.get('/friends/:username/:page',fetchFriends)
module.exports = router;
