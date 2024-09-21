const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Добавлено поле описания
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [String],
  dislikedBy: [String],
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
