const express = require('express');
const videoController = require('../controllers/videoController');
const multer = require('../middlewares/multerConfig');  // Multer middleware для загрузки файлов

const router = express.Router();

// Маршрут для загрузки видео
router.post('/upload', multer.single('video'), videoController.uploadVideo);

// Маршрут для получения всех видео
router.get('/', videoController.getVideos);

// Маршрут для поиска видео
router.get('/search', videoController.searchVideos);

// Маршрут для получения одного видео по ID
router.get('/:id', videoController.getVideoById);

// Маршрут для увеличения просмотров
router.post('/:id/view', videoController.incrementViews);

// Маршрут для лайка видео
router.post('/:id/like', videoController.likeVideo);

// Маршрут для удаления видео
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
