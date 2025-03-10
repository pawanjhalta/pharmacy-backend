import express from "express";
import { config } from "dotenv";
import medicineRoutes from "./routes/medicineRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import authRoute from "./routes/authRoutes.js";
import cors from "cors";

config({ path: "./config/config.env" });

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);
// Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/users",authRoute);

