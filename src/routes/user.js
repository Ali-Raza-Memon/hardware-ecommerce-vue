const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/customerController');

router.get('/details', getUserDetails);

module.exports = router;