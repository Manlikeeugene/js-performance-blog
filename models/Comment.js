// app/models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // For replies (optional)
}, {
  timestamps: true
});

CommentSchema.index({ post: 1, createdAt: -1 }); // For fetching comments by post

let cachedModel;

export default function getCommentModel() {
  if (mongoose.models.Comment || cachedModel) {
    return mongoose.models.Comment || cachedModel;
  }
  cachedModel = mongoose.model('Comment', CommentSchema);
  return cachedModel;
}