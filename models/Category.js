// app/models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

let cachedModel;

export default function getCategoryModel() {
  if (mongoose.models.Category || cachedModel) {
    return mongoose.models.Category || cachedModel;
  }
  cachedModel = mongoose.model('Category', CategorySchema);
  return cachedModel;
}