const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

// Temporary storage for users (in-memory)
const users = [];

// Register route
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    users.push({ name, email, password }); // store temporarily
    res.status(200).json({ message: 'Registration successful' });
  } else {
    res.status(400).json({ message: 'All fields required' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
