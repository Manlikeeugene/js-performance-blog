// import mongoose from 'mongoose';

// const PostSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   excerpt: { type: String, required: true },
//   image: String,
//   category: { type: String, required: true },
//   tags: [String],
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['draft', 'published'], default: 'draft' },
//   views: { type: Number, default: 0 },
//   likes: { type: Number, default: 0 },
//   readTime: String,
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Optional: Index for faster queries (e.g., by author or status)
// PostSchema.index({ author: 1 });
// PostSchema.index({ status: 1, createdAt: -1 });

// let cachedModel;

// export default function getPostModel() {
//   if (mongoose.models.Post || cachedModel) {
//     return mongoose.models.Post || cachedModel;
//   }
//   cachedModel = mongoose.model('Post', PostSchema);
//   return cachedModel;
// }



import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  image: String,
  category: { type: String, required: true },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  readTime: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PostSchema.index({ author: 1 });
PostSchema.index({ status: 1, createdAt: -1 });

let cachedModel;

export default function getPostModel() {
  if (mongoose.models.Post || cachedModel) {
    return mongoose.models.Post || cachedModel;
  }
  cachedModel = mongoose.model('Post', PostSchema);
  return cachedModel;
}