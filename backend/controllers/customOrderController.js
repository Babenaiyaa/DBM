import CustomOrder from "../models/CustomOrder.js";

// Create a new custom order (already exists)
export const createCustomOrder = async (req, res) => {
  try {
    const { name, whatsapp, address, expectedDelivery, material, sizeDetails } = req.body;
    const images = req.files?.map((file) => file.path) || [];

    const newOrder = await CustomOrder.create({
      name,
      whatsapp,
      address,
      expectedDelivery,
      material,
      sizeDetails,
      referenceImages: images,
    });

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

// ✅ New function: Get all custom orders
export const getCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch Custom Orders Error:", error);
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
