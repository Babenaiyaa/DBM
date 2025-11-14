import Order from "../models/Order.js";

// Generate unique reference ID
function generatePaymentRef() {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timePart = Date.now().toString().slice(-4);
  return `REF-${randomPart}-${timePart}`;
}

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      whatsapp,
      address,
      paymentMethod,
      items,
      totalPrice,
    } = req.body;

    const paymentRefId =
      paymentMethod === "Bank Transfer" ? generatePaymentRef() : null;

    const newOrder = await Order.create({
      customerName,
      whatsapp,
      address,
      paymentMethod,
      paymentRefId,
      orderItems: items,
      totalPrice,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: "Order not found" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
