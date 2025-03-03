require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { csrfProtection, generateToken } = require('./middlewares/csrf');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
// Update the CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN']
}));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate CSRF token for all routes
app.use(generateToken);

// Use CSRF protection for all routes except login/signup
app.use(csrfProtection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});