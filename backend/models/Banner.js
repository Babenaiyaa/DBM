import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ctaText: { type: String, required: true },
  ctaUrl: { type: String, required: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
