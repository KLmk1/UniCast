const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Маршрут для регистрации
router.post('/register', authController.registerUser);

module.exports = router;
f