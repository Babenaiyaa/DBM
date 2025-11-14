import express from "express";
import {
  createCustomOrder,
  getCustomOrders,
  deleteCustomOrder
} from "../controllers/customOrderController.js";
import { uploadCustomOrderImages } from "../middleware/upload.js";

const router = express.Router();

// Create custom order
router.post("/", uploadCustomOrderImages.array("referenceImages", 3), createCustomOrder);

// Get all custom orders
router.get("/", getCustomOrders);

// Delete a custom order
router.delete("/:id", deleteCustomOrder);

export default router;
