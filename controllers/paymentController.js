import cloudinary from "cloudinary";


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { Payment } from "../models/paymentModel.js";

dotenv.config();
const { v2 } = cloudinary;
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "payments", // Cloudinary folder name
    format: async (req, file) => "png", // or 'jpeg', 'jpg'
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

const upload = multer({ storage }).single("paymentProof");

// Create a new payment record
export const createPayment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err });
    }

    const { name, address, phone, amount } = req.body;
    if (!name || !address || !phone || !amount || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const newPayment = new Payment({
        name,
        address,
        phone,
        amount,
        paymentProof: req.file.path, // Cloudinary URL
      });

      await newPayment.save();
      res.status(201).json({ message: "Payment submitted successfully", newPayment });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  });
};


// Get all payment records
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get a single payment record by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Update payment status (e.g., verify payment)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment status updated", payment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete a payment record
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
