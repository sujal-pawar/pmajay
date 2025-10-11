// Load environment variables first
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const socketService = require('./utils/socketService');

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
const messageRoutes = require('./routes/messageRoutes');

// Connect to database
connectDB();

// Initialize express
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  next();
});

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // List of allowed origins (normalized - no trailing slashes)
    const allowedOrigins = [     
      'http://localhost:3000', 
      'https://pmajay.vercel.app'
    ].map(url => url.replace(/\/$/, '')); // Normalize by removing trailing slashes
    
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked request from origin:', origin);
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// PM-AJAY Project Management API routes
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

// Nested routes for project resources
app.use('/api/projects/:projectId/milestones', milestoneRoutes);
app.use('/api/projects/:projectId/progress', progressRoutes);
app.use('/api/projects/:projectId/funds', fundRoutes);
app.use('/api/projects/:projectId/beneficiaries', beneficiaryRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Test route to check if users exist
app.get('/api/test/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    const sampleUser = await User.findOne({ email: 'gp@govandi.gov.in' }).select('name email role');
    res.json({ 
      status: 'OK', 
      userCount,
      sampleUser,
      message: 'Users check complete'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Initialize Socket.IO
socketService.initialize(server);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.IO server running on port ${PORT}`);
});
