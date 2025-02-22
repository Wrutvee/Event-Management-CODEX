require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require('csurf');

const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to enable CORS
app.use(
  cors({
    origin: "http://localhost:5174", // Allow only this origin
    methods: ["GET", "POST"], // Allow only specific methods
    credentials: true, // Allow cookies and authentication headers
  })
);

// Middleware to parse cookies (must come before csrf)
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// CSRF protection
app.use(csrf({
  cookie: {
    key: 'XSRF-TOKEN',
    httpOnly: false, // Frontend needs to read it
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Error handler for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  } else {
    next(err);
  }
});

// Provide CSRF token to frontend
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Auth routes
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("server started");
});
