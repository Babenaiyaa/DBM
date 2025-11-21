// models/CustomOrder.js
import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String }, // Optional customer email for notifications
    address: { type: String },
    expectedDelivery: { type: String },
    material: { type: String, required: true },
    sizeDetails: { type: String, required: true },

    referenceImages: [
      {
        type: String, // URL or file path
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomOrder", customOrderSchema);
