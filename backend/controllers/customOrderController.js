import CustomOrder from "../models/CustomOrder.js";
import { sendEmail } from "../utils/emailService.js";

// Create a new custom order
export const createCustomOrder = async (req, res) => {
  try {
    const {
      name,
      whatsapp,
      email,
      address,
      expectedDelivery,
      material,
      sizeDetails,
    } = req.body;
    const images = req.files?.map((file) => file.path) || [];

    const newOrder = await CustomOrder.create({
      name,
      whatsapp,
      email,
      address,
      expectedDelivery,
      material,
      sizeDetails,
      referenceImages: images,
    });

    // Send email notification if email is provided
    if (email) {
      void sendEmail({
        to: email,
        subject: "Custom order submitted successfully",
        text: `Hi ${name},\n\nYour custom order has been received. We will contact you shortly.\n\nThank you!`,
        html: `<p>Hi ${name},</p><p>Your custom order has been <strong>received</strong>. We will contact you shortly.</p><p>Thank you!</p>`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Custom order submitted successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Custom Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all custom orders
export const getCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch Custom Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Confirm a custom order (used by admin panel)
export const confirmCustomOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await CustomOrder.findByIdAndUpdate(
      id,
      { status: "Confirmed" },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Custom order not found" });
    }

    // Notify customer via email if available
    if (order.email) {
      void sendEmail({
        to: order.email,
        subject: "Your custom order has been confirmed",
        text: `Hi ${order.name},\n\nYour custom order has been confirmed. We will proceed with your request and share further updates.\n\nThank you!`,
        html: `<p>Hi ${order.name},</p><p>Your custom order has been <strong>confirmed</strong>. We will proceed with your request and share further updates.</p><p>Thank you!</p>`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Custom order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("Confirm Custom Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Optional: delete a custom order
export const deleteCustomOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await CustomOrder.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Custom order deleted" });
  } catch (error) {
    console.error("Delete Custom Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
