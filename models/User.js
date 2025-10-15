import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash this with bcrypt in auth
  image: { type: String }, // Profile avatar URL
  bio: { type: String },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Array ref to user's posts for easy querying
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For social features (e.g., dashboard followers stat)
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Auto-updates createdAt/updatedAt
});

// Index for faster queries (posts only; email is auto-indexed via unique: true)
UserSchema.index({ posts: 1 });

let cachedModel;

export default function getUserModel() {
  if (mongoose.models.User || cachedModel) {
    return mongoose.models.User || cachedModel;
  }
  cachedModel = mongoose.model('User', UserSchema);
  return cachedModel;
}