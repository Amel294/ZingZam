const express = require('express');
const { getSuggestions,requestHandle,requestResponse,getRequests } = require('../controllers/connectionController');
const router = express.Router();
router.get('/suggestions', getSuggestions);
router.post('/request', requestHandle);
router.get('/requests',getRequests)
router.post('/requestResponse', requestResponse);
module.exports = router;
