const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  fileName: String,
  filePath: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [String],   // Массив идентификаторов пользователей, которые поставили лайк
  dislikedBy: [String] // Массив идентификаторов пользователей, которые поставили дизлайк
});

module.exports = mongoose.model('Video', videoSchema);
