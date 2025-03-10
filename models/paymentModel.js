import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentProof: {
      type: String, // This will store the file URL
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Payment= mongoose.model("Payment", PaymentSchema);
