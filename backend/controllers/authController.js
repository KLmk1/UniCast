const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger'); // Импортируем логгер

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Убедитесь, что ключ безопасности хранится в .env

// Регистрация
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    logger.info(`User registered: ${username}`); // Логируем успешную регистрацию пользователя
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Error registering user:', error); // Логируем ошибку
    res.status(500).json({ error: 'Error registering user' });
  }
};

// Логин
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login attempt failed: User not found - ${username}`); // Логируем неудачную попытку входа
      return res.status(401).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login attempt failed: Invalid credentials for user - ${username}`); // Логируем неудачную попытку входа
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    logger.info(`User logged in: ${username}`); // Логируем успешный вход
    res.json({ token });
  } catch (error) {
    logger.error('Error logging in:', error); // Логируем ошибку
    res.status(500).json({ error: 'Error logging in' });
  }
};
