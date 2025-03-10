import { Medicine } from "../models/medicineModel.js";

// @desc Get all medicines
// @route GET /api/medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error });
  }
};

// @desc Get a single medicine by ID
// @route GET /api/medicines/:id
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicine", error });
  }
};

// @desc Add a new medicine
// @route POST /api/medicines
export const addMedicine = async (req, res) => {
  try {
    const { id, name, price, exp, stock, category } = req.body;
    const existingMedicine = await Medicine.findOne({ id });
    
    if (existingMedicine) return res.status(400).json({ message: "Medicine ID already exists" });

    const newMedicine = new Medicine({ id, name, price, exp, stock, category });
    await newMedicine.save();
    res.status(201).json({ message: "Medicine added successfully", newMedicine });
  } catch (error) {
    res.status(500).json({ message: "Error adding medicine", error });
  }
};

// @desc Update a medicine by ID
// @route PUT /api/medicines/:id
export const updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMedicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ message: "Medicine updated successfully", updatedMedicine });
  } catch (error) {
    res.status(500).json({ message: "Error updating medicine", error });
  }
};

// @desc Delete a medicine by ID
// @route DELETE /api/medicines/:id
export const deleteMedicine = async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!deletedMedicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medicine", error });
  }
};
