const express = require('express');
const router = express.Router();
const { verifyToken } = require("../auth/verify");
const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');
const { validatePassword } = require('../utils/validation');

// Get admin profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update admin profile
router.put("/", verifyToken, async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    
    // Find admin and update
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Update fields if provided
    if (name) admin.name = name;
    if (profilePic) admin.profilePic = profilePic;

    await admin.save();

    // Return updated admin without password
    const updatedAdmin = await Admin.findById(admin._id).select('-password');
    res.json({ success: true, admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters and contain uppercase, lowercase, numbers and special characters" 
      });
    }

    const admin = await Admin.findById(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;