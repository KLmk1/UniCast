const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('./models/Video'); // Подключаем модель Video
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // Разрешаем запросы с фронтенда
}));

app.use(express.json()); // Для парсинга JSON

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/videoapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Настройка Multer для сохранения видеофайлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Создаем папку, если её нет
    }
    cb(null, uploadDir); // Указываем путь для хранения файлов
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Уникальное имя файла
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Ограничение на размер 100MB
});

// Маршрут для загрузки видео
app.post('/upload', upload.single('video'), async (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a video' });
  }

  try {
    // Сохраняем информацию о видео в MongoDB
    const newVideo = new Video({
      title,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
    });
    
    await newVideo.save();

    res.json({
      message: 'Video uploaded successfully',
      video: newVideo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save video to database' });
  }
});

// Маршрут для получения списка видео
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find(); // Получаем все видео из базы данных
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
});

// Маршрут для получения одного видео по его id
app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id); // Поиск видео по id
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video); // Возвращаем видео
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve video' });
  }
});

// Маршрут для увеличения количества просмотров
app.post('/api/videos/:id/view', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    video.views += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update views' });
  }
});

const getUserIdentifier = (req) => {
  // Пример получения IP-адреса (можно заменить на идентификатор пользователя из аутентификации)
  return req.ip;
};

// Увеличение количества лайков
app.post('/api/videos/:id/like', async (req, res) => {
  const userId = req.ip; // Или другой идентификатор пользователя

  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    if (video.likedBy.includes(userId)) {
      return res.status(400).json({ error: 'You have already liked this video' });
    }
    
    if (video.dislikedBy.includes(userId)) {
      video.dislikes -= 1;
      video.dislikedBy = video.dislikedBy.filter(id => id !== userId);
    }
    
    video.likes += 1;
    video.likedBy.push(userId);
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Увеличение количества дизлайков
app.post('/api/videos/:id/dislike', async (req, res) => {
  const userId = req.ip; // Или другой идентификатор пользователя

  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    if (video.dislikedBy.includes(userId)) {
      return res.status(400).json({ error: 'You have already disliked this video' });
    }
    
    if (video.likedBy.includes(userId)) {
      video.likes -= 1;
      video.likedBy = video.likedBy.filter(id => id !== userId);
    }
    
    video.dislikes += 1;
    video.dislikedBy.push(userId);
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dislikes' });
  }
});


// Статическая раздача видеофайлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршрут для удаления видео
app.delete('/api/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id;

    // Находим видео по ID в базе данных
    const video = await Video.findById(videoId);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Путь к видеофайлу на сервере
    const filePath = path.join(__dirname, 'uploads', video.fileName);

    // Удаляем видео из базы данных
    await Video.findByIdAndDelete(videoId);

    // Удаляем файл видео из файловой системы
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Failed to delete video file' });
      }

      res.json({ message: 'Video deleted successfully' });
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Добавляем маршрут для поиска видео
app.get('/api/videos/search', async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.status(400).json({ error: 'No search query provided' });
  }

  try {
    // Проверка правильности запроса
    console.log('Search query:', query);
    
    const videos = await Video.find({ title: { $regex: new RegExp(query, 'i') } });
    
    // Логируем найденные видео для проверки
    console.log('Found videos:', videos);
    
    res.json(videos);
  } catch (error) {
    console.error('Error performing search:', error); // Логируем подробности ошибки
    res.status(500).json({ error: 'Failed to perform search' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
