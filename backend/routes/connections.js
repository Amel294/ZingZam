const express = require('express');
const { getSuggestions,addFriend } = require('../controllers/connectionController');
const router = express.Router();
router.get('/suggestions', getSuggestions);
router.post('/add', addFriend);
module.exports = router;
