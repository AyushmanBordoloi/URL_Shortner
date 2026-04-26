const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const urlRoutes = require('./routes/url');
//const { redirectToOriginalURL } = require('./controllers/url');
app.use('/url', urlRoutes);
//app.get('/:code', redirectToOriginalURL);

// Start the server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));