const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const detectRoutes = require('./routes/detect');
const historyRoutes = require('./routes/history');
const diseasesRoutes = require('./routes/diseases');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with credential support for cookie transmissions
app.use(cors({
  origin: 'http://localhost:5173', // Vite client domain
  credentials: true
}));

// Body and cookie parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploaded photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrovision';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch((err) => console.error('MongoDB database connection error:', err.message));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/detect', detectRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/diseases', diseasesRoutes);

// Base status check
app.get('/', (req, res) => {
  res.json({ message: 'AgroVision AI Node Server Online.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: err.message || 'Internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
