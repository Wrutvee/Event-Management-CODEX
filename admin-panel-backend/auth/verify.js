const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');


const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        req.user = {
            id: admin._id,
            email: admin.email,
            profilePic: admin.profilePic,
            name: admin.name,
            role: admin.role,
            createdAt: admin.createdAt,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = {
    verifyToken
};