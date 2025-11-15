// ---------------------- IMPORTS ----------------------
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

// ---------------------- APP SETUP ----------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------------- DATABASE CONNECTION ----------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// ---------------------- SCHEMAS ----------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const orderSchema = new mongoose.Schema({
  email: String,
  medicine: String,
  quantity: Number,
  address: String
});

const consultationSchema = new mongoose.Schema({
  email: String,
  doctor: String,
  date: String,
  time: String
});

const reportSchema = new mongoose.Schema({
  email: String,
  filename: String
});

// ---------------------- MODELS ----------------------
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const Consultation = mongoose.model('Consultation', consultationSchema);
const Report = mongoose.model('Report', reportSchema);

// ---------------------- TEST ROUTE ----------------------
app.get('/', (req, res) => {
  res.send('✅ Backend is running and connected to MongoDB!');
});

// ---------------------- AUTH ROUTES ----------------------

// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: "All fields are required!" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already registered!" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Change Password
app.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email, password: oldPassword });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid old password!" });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- FEATURE ROUTES ----------------------

// Order Medicine
app.post('/order-medicine', async (req, res) => {
  const { email, medicine, quantity, address } = req.body;
  if (!email || !medicine || !quantity || !address)
    return res.json({ success: false, message: "All fields are required!" });

  const newOrder = new Order({ email, medicine, quantity, address });
  await newOrder.save();
  res.json({ success: true, message: "Medicine ordered successfully!" });
});

// Consult Doctor
app.post('/consult-doctor', async (req, res) => {
  const { email, doctor, date, time } = req.body;
  if (!email || !doctor || !date || !time)
    return res.json({ success: false, message: "All fields are required!" });

  const newConsult = new Consultation({ email, doctor, date, time });
  await newConsult.save();
  res.json({ success: true, message: "Doctor consultation booked successfully!" });
});

// Upload Report
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload-report', upload.single('file'), async (req, res) => {
  const { email } = req.body;
  if (!email || !req.file)
    return res.json({ success: false, message: "Please provide email and report file!" });

  const newReport = new Report({ email, filename: req.file.originalname });
  await newReport.save();
  res.json({ success: true, message: "Report uploaded successfully!" });
});

// Search Symptoms
const symptomDB = {
  fever: ["Paracetamol", "Dolo 650", "Crocin"],
  cough: ["Benadryl", "Ascoril", "Cough Syrup"],
  headache: ["Saridon", "Disprin", "Paracetamol"],
};

app.post('/search-symptoms', (req, res) => {
  const { symptom } = req.body;
  if (!symptom)
    return res.json({ success: false, message: "Please enter a symptom!" });

  const medicines = symptomDB[symptom.toLowerCase()] || ["No suggestions found"];
  res.json({ success: true, medicines });
});

// ---------------------- SERVER START ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localcdhost:${PORT}`));


app.use("/api/auth", require("./routes/auth"));

