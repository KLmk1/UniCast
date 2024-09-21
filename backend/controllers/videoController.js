const Video = require('../models/Video');
const fs = require('fs').promises;  // Используем промисы для работы с fs
const path = require('path');

// Загрузка видео
exports.uploadVideo = async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title,
      description: req.body.description,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
    });

    const savedVideo = await newVideo.save();
    res.json(savedVideo); // Отправляем обратно JSON с данными видео
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};



// Получение всех видео
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
};

// Поиск видео
exports.searchVideos = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'No search query provided' });
  }

  try {
    const videos = await Video.find({ title: { $regex: new RegExp(query, 'i') } });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform search' });
  }
};

// Получение видео по ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve video' });
  }
};

// Увеличение количества просмотров
exports.incrementViews = async (req, res) => {
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
};

// Лайк видео
exports.likeVideo = async (req, res) => {
  const userId = req.ip;

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
};

// Дисклайк видео
exports.dislikeVideo = async (req, res) => {
  const userId = req.ip;

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
};

// Удаление видео
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const filePath = path.join(__dirname, '../uploads', video.fileName);

    await Video.findByIdAndDelete(req.params.id);

    await fs.unlink(filePath);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
};
