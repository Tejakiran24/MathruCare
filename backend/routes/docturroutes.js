const express = require("express");
const router = express.Router();
const { getDoctors, addDoctor } = require("../controllers/doctorController");

// Get all doctors
router.get("/", getDoctors);

// Add new doctor
router.post("/add", addDoctor);

module.exports = router;
