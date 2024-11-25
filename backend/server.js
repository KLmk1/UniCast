const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Для работы с путями
const dotenv = require('dotenv');
const videoRoutes = require('./routes/videoRoutes'); // Проверь путь
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middlewares/authenticateToken'); // Подключаем middleware

dotenv.config(); // Загружаем переменные окружения

const app = express();
const PORT = process.env.PORT || 5000; // Используем переменную окружения или 5000 по умолчанию

app.use(cors({
  origin: 'http://localhost:5173', // Укажи фронтенд
}));

app.use(express.json()); // Для обработки JSON
app.use(express.urlencoded({ extended: true })); // Для обработки URL-encoded данных

// Путь для статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение маршрутов для API
app.use('/api/videos', videoRoutes);
app.use('/auth', authRoutes);

// Пример защищенного маршрута
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
