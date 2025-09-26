// Load environment variables first
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// PM-AJAY Project Management routes
const projectRoutes = require('./routes/projectRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const progressRoutes = require('./routes/progressRoutes');
const fundRoutes = require('./routes/fundRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');

// Connect to database
connectDB();

// Initialize express
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : true,
  credentials: true
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// PM-AJAY Project Management API routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/milestones', milestoneRoutes);
app.use('/api/projects/:projectId/progress', progressRoutes);
app.use('/api/projects/:projectId/funds', fundRoutes);
app.use('/api/projects/:projectId/beneficiaries', beneficiaryRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Basic route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'OAuth Authentication API Server',
    version: '1.0.0'
  });
});

// Error handler middleware
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
