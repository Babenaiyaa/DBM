import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String },
  availableQuantity: { type: Number, default: 0 },
  category: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
