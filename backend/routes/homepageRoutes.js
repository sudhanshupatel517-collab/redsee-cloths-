const express = require('express');
const { getHomepageData } = require('../controllers/homepageController');

const router = express.Router();

router.route('/').get(getHomepageData);

module.exports = router;
