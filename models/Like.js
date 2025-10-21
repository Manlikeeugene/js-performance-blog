// app/models/Like.js
import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

LikeSchema.index({ post: 1, user: 1 }, { unique: true }); // Prevent duplicate likes

let cachedModel;

export default function getLikeModel() {
  if (mongoose.models.Like || cachedModel) {
    return mongoose.models.Like || cachedModel;
  }
  cachedModel = mongoose.model('Like', LikeSchema);
  return cachedModel;
}