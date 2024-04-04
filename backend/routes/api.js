const express = require('express');
const { accessTokenValidation, refreshToken } = require('../controllers/apiController');
const router = express.Router();

router.post("/validateAccessToken", accessTokenValidation);
router.post('/test', (req, res) => {
    console.log("Test Route hit");
    const refreshToken = req?.cookies?.refreshToken; // Assuming refreshToken stored in cookie
    const accessToken = req?.cookies?.accessToken; // Corrected to access accessToken cookie
    console.log("test");
    console.log(refreshToken);
    console.log(accessToken);
    res.sendStatus(200); // Changed to sendStatus instead of send
});

module.exports = router;
