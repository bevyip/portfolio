// Require Libraries
const express = require('express');

// App Setup
const app = express();
const path = require("path");

// set static directories
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+ '/public/pages/index.html'));
});

app.get('/salesforce-test', (req, res) => {
  res.sendFile(path.join(__dirname+ '/public/pages/salesforce-test.html'));
})

// Start Server
app.listen(3000, () => {
  console.log('Listening on port localhost:3000!');
});
