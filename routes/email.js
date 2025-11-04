const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const emailController = require('../controllers/emailController');

const router = express.Router();

// Send welcome email to booking
router.post('/send-welcome/:id', authMiddleware, emailController.sendWelcome);

// Test email configuration
router.get('/test', authMiddleware, emailController.testEmail);

module.exports = router;