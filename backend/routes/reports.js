const express = require('express');
const { reportPost,getReports,changeStatus,reportDetails } = require('../controllers/ReportController');
const { accessTokenValidation } = require('../helpers/accessTokenValidation');
const { isUserCheck } = require('../helpers/isUserCheck');
const { isBlocked } = require('../helpers/blockedCheck');
const { adminTokenValidation } = require('../helpers/adminTokenValidation');
const { isAdminCheck } = require('../helpers/isAdminCheck');
const router = express.Router();
router.post('/reportPost',accessTokenValidation,isUserCheck,isBlocked ,reportPost);
router.get('/reports',adminTokenValidation,isAdminCheck, getReports)
router.patch('/report-status',adminTokenValidation,isAdminCheck,changeStatus)
router.get('/details/:reportId',adminTokenValidation,isAdminCheck,reportDetails)
module.exports = router;
