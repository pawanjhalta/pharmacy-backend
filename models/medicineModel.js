import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  exp: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    min: 0 
  },
  category: { 
    type: String,  
    enum: ["antibiotic", "painkiller", "vitamin", "antifungal", "antiviral", "other"], 
    default: "other"
  }
}, { timestamps: true });

export const Medicine = mongoose.model("Medicine", medicineSchema);

