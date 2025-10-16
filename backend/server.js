const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling file uploads

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

// 🧩 Dummy database (temporary)
const orders = [];
const consultations = [];
const reports = [];
const symptomDB = {
  fever: ["Paracetamol", "Dolo 650", "Crocin"],
  cough: ["Benadryl", "Ascoril", "Cough Syrup"],
  headache: ["Saridon", "Disprin", "Paracetamol"],
};

// ✅ Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@gmail.com" && password === "1234") {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// ✅ Register route
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required!" });
  }
  res.json({ success: true, message: "User registered successfully!" });
});

// ✅ Change password route
app.post('/change-password', (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (email === "admin@gmail.com" && oldPassword === "1234") {
    res.json({ success: true, message: "Password changed successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid old password!" });
  }
});

// ✅ Order Medicine
app.post('/order-medicine', (req, res) => {
  const { email, medicine, quantity, address } = req.body;
  if (!email || !medicine || !quantity || !address) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  orders.push({ email, medicine, quantity, address });
  console.log("New Order:", orders);
  res.json({ success: true, message: "Medicine ordered successfully!" });
});

// ✅ Consult Doctor
app.post('/consult-doctor', (req, res) => {
  const { email, doctor, date, time } = req.body;
  if (!email || !doctor || !date || !time) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  consultations.push({ email, doctor, date, time });
  console.log("New Consultation:", consultations);
  res.json({ success: true, message: "Doctor consultation booked successfully!" });
});

// ✅ Upload Report
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post('/upload-report', upload.single('file'), (req, res) => {
  const { email } = req.body;
  if (!email || !req.file) {
    return res.json({ success: false, message: "Please provide email and report file!" });
  }

  reports.push({ email, filename: req.file.originalname });
  console.log("Uploaded Reports:", reports);
  res.json({ success: true, message: "Report uploaded successfully!" });
});

// ✅ Search Symptoms
app.post('/search-symptoms', (req, res) => {
  const { symptom } = req.body;
  if (!symptom) {
    return res.json({ success: false, message: "Please enter a symptom!" });
  }

  const medicines = symptomDB[symptom.toLowerCase()] || ["No suggestions found"];
  res.json({ success: true, medicines });
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
