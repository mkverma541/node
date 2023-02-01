const express = require('express');
const testController = require('../controllers/test.controller');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// routes

// router.route('/:category').get(testController.test);

module.exports = router;