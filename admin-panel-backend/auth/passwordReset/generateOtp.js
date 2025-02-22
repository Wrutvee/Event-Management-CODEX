const crypto = require('crypto');
const OTP = require('../../models/OTP');
const Admin = require('../../models/Admin');
const { sendPasswordResetMail } = require('../../mailer/mailer');

const generateOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email exists in Admin collection
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }
        
        // Generate a 6 digit OTP
        const otp = crypto.randomInt(100000, 999999);
        
        // Store OTP in database
        await OTP.findOneAndUpdate(
            { email }, 
            { otp: otp.toString() },
            { upsert: true, new: true }
        );
        
        // Send OTP via email using existing mailer
        await sendPasswordResetMail(email, otp);
        
        res.json({ 
            success: true, 
            message: 'Password reset OTP generated successfully'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating password reset OTP' 
        });
    }
};

module.exports = {
    generateOtp
};
