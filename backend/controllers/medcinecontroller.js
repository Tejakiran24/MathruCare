const Medicine = require("../models/medicineModel");

// Get all medicines
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new medicine
const addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json({ message: "Medicine added successfully", medicine });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getMedicines, addMedicine };
