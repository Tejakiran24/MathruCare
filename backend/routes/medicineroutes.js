const express = require("express");
const router = express.Router();
const { getMedicines, addMedicine } = require("../controllers/medicineController");

// Get all medicines
router.get("/", getMedicines);

// Add new medicine
router.post("/add", addMedicine);

module.exports = router;
