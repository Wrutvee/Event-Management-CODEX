require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require('csurf');

const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/events");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to enable CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.29.21:5173",
  "http://192.168.29.50:5173",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, 
    methods: ["GET", "POST"], 
    credentials: true, 
  })
);

// Middleware to parse cookies (must come before csrf)
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// CSRF protection
app.use(
  csrf({
    cookie: {
      key: "XSRF-TOKEN",
      httpOnly: false, // Frontend needs to read it
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    },
    value: (req) => req.headers["x-csrf-token"],
  })
);

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
app.use("/events", eventRoutes);

app.listen(3000, () => {
  console.log("server started");
});
