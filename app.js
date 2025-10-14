// Import required modules
const express = require('express');
const bodyParser = require('body-parser'); // Optional: for parsing request bodies
const cors = require('cors'); // Optional: for cross-origin requests

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Example routes
app.get('/', (req, res) => {
  res.send('Welcome to MathruCare Backend!');
});

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Export the app (so it can be used in server.js)
module.exports = app;
