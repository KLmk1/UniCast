const express = require('express');
const router = express.Router();
const Video = require('../models/Video'); // Подключаем модель Video

// Увеличение количества просмотров
router.post('/videos/:id/view', async (req, res) => {
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

// Увеличение количества лайков
router.post('/videos/:id/like', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    video.likes += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Увеличение количества дизлайков
router.post('/videos/:id/dislike', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    video.dislikes += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dislikes' });
  }
});

module.exports = router;
