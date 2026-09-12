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

// Trust Railway / cloud reverse proxy load balancer for secure cookies over HTTPS
app.set('trust proxy', 1);

// Enable CORS with credential support for cookie transmissions across local & Docker domains
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server, or same-origin)
    if (!origin) return callback(null, true);
    return callback(null, true); // Dynamically reflects origin so credentials: true works seamlessly
  },
  credentials: true
}));

// Body and cookie parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploaded photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (supports MONGO_URI, Railway MONGO_URL, or DATABASE_URL)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/agrovision';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch((err) => console.error('MongoDB database connection error:', err.message));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/detect', detectRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/diseases', diseasesRoutes);

// Base status and health checks
app.get('/', (req, res) => {
  res.json({ message: 'AgroVision AI Node Server Online.' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
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
