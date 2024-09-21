const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Добавляем модуль path
const videoRoutes = require('./routes/videoRoutes'); // Проверьте путь

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173', // Укажи фронтенд
}));
app.use(express.json()); // Для обработки JSON
app.use(express.urlencoded({ extended: true })); // Для обработки URL-encoded данных

// Путь для статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение маршрутов для API
app.use('/api/videos', videoRoutes);

mongoose.connect('mongodb://localhost:27017/videoapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
