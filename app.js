// Require Libraries
const express = require('express');

// App Setup
const app = express();
const path = require("path");

// set static directories
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+ '/index.html'));
});

app.get('/salesforce-canvas-enhancements', (req, res) => {
  res.sendFile(path.join(__dirname+ '/salesforce-canvas-enhancements.html'));
})

app.get('/salesforce-resource-selection-experience', (req, res) => {
  res.sendFile(path.join(__dirname+ '/salesforce-resource-selection.html'));
})

// Start Server
app.listen(3000);
