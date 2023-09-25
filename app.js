// Require Libraries
const express = require('express');

// App Setup
const app = express();

// Middleware

// Routes
app.get('/', (req, res) => {
  res.send('Hello Bev');
});

// Start Server
app.listen(3000, () => {
  console.log('Listening on port localhost:3000!');
});
