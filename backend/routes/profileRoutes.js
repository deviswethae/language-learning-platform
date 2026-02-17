const express = require('express');
const router = express.Router();

// Your controller functions
const { getProfile, updateProfile } = require('../controllers/profileController');

// Define routes
router.get('/', getProfile);
router.post('/', updateProfile);

module.exports = router;
