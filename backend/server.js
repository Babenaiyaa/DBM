
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import Admin from './models/Admin.js'; 
import bannerRoutes from './routes/bannerRoutes.js';
import { protectAdmin } from "./middleware/authMiddleware.js";
import productRoutes from './routes/productRoutes.js'
import customOrderRoutes from "./routes/customOrderRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const existingAdmin = await Admin.findOne({});
    if (!existingAdmin) {
      const admin = new Admin({ password: process.env.ADMIN_PASSWORD });
      await admin.save();
      console.log('Default admin created with password:', process.env.ADMIN_PASSWORD);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/admin', authRoutes);
app.use('/api/banners', bannerRoutes);  
app.use('/api/products', productRoutes);
// Protected Routes
//app.use('/api/banners', protectAdmin, bannerRoutes); // token required
// Custom Order API
app.use("/api/custom-orders", customOrderRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
