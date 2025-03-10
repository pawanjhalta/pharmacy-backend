import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Payment routes
router.post("/", createPayment); // Submit payment
router.get("/", getPayments); // Get all payments
router.get("/:id", getPaymentById); // Get payment by ID
router.patch("/:id", updatePaymentStatus); // Update payment status
router.delete("/:id", deletePayment); // Delete payment

export default router;
