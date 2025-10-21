import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  entityType: { type: String, enum: ['user', 'post'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'entityType' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  followers: { type: Number, default: 0 }, // For user stats only
  posts: { type: Number, default: 0 }, // For user stats only
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

StatsSchema.index({ entityType: 1, entityId: 1 }, { unique: true });

let cachedModel;

export default function getStatsModel() {
  if (mongoose.models.Stats || cachedModel) {
    return mongoose.models.Stats || cachedModel;
  }
  cachedModel = mongoose.model('Stats', StatsSchema);
  return cachedModel;
}