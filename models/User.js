import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

let cachedModel;

export default function getUserModel() {
  if (mongoose.models.User || cachedModel) {
    return mongoose.models.User || cachedModel;
  }
  cachedModel = mongoose.model('User', UserSchema);
  return cachedModel;
}