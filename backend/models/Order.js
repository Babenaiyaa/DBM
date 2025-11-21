import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  customerName: String,
  whatsapp: String,
  email: String, // Optional customer email for notifications
  address: String,
  paymentMethod: String, // COD or Bank Transfer
  paymentRefId: { type: String, default: null },
  totalPrice: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
