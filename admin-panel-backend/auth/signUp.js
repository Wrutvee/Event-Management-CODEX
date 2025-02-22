const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const InviteCode = require('../models/InviteCode');
const { validatePassword } = require('../utils/validation');

const handleSignup = async (req, res) => {
    try {
        const { email, name, password, inviteCode } = req.body;

        // Input validation
        if (!email || !password || !inviteCode) {
            return res.status(400).json({
                success: false,
                message: "Email, password and invite code are required",
            });
        }

        // Password validation
        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and contain uppercase, lowercase, numbers and special characters"
            });
        }

        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Verify invite code
        const invite = await InviteCode.findOne({
            code: inviteCode,
            used: false,
            expiresAt: { $gt: new Date() },
        });

        if (!invite) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired invite code",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({
            email,
            name,
            password: hashedPassword,
            role: invite.roleAssigned,
        });

        // Save admin
        await newAdmin.save();

        // Mark invite code as used
        invite.used = true;
        invite.usedBy = newAdmin._id;
        await invite.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newAdmin._id, role: newAdmin.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: newAdmin._id,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration'
        });
    }
};

module.exports = {
    handleSignup
};