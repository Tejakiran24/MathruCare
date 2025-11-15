const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../controllers/userController");  // OR correct path
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route example
router.get("/dashboard", auth, (req, res) => {
    res.json({
        message: "Welcome to your dashboard",
        userId: req.user.userId
    });
});

module.exports = router;
