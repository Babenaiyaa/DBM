import Order from "../models/Order.js";
import { sendEmail } from "../utils/emailService.js";

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
      email,
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
      email,
      address,
      paymentMethod,
      paymentRefId,
      orderItems: items,
      totalPrice,
    });

    // Notify customer by email if address provided
    if (email) {
      const isBankTransfer = paymentMethod === "Bank Transfer";
      const subject = isBankTransfer
        ? "Your order has been placed - bank transfer details"
        : "Your order has been placed successfully";

      const lines = [
        `Hi ${customerName},`,
        "",
        "Thank you for your order.",
        isBankTransfer && paymentRefId
          ? `Your payment reference ID is: ${paymentRefId}.`
          : null,
        "",
        `Total amount: Rs. ${totalPrice}`,
        "",
        "We will contact you soon with delivery details.",
        "",
        "Best regards,",
        "DBM",
      ].filter(Boolean);

      void sendEmail({
        to: email,
        subject,
        text: lines.join("\n"),
        html: `<p>${lines.join("</p><p>")}</p>`,
      });
    }

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

    // Optionally send email when status becomes successful
    if (updatedOrder?.email && status === "Completed") {
      void sendEmail({
        to: updatedOrder.email,
        subject: "Your order has been completed",
        text: `Hi ${updatedOrder.customerName},\n\nYour order has been marked as completed. It will be delivered soon.\n\nThank you!`,
        html: `<p>Hi ${updatedOrder.customerName},</p><p>Your order has been <strong>completed</strong>. It will be delivered soon.</p><p>Thank you!</p>`,
      });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
