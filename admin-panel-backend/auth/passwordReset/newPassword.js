const bcrypt = require('bcryptjs');
const Admin = require('../../models/Admin');
const OTP = require('../../models/OTP');

const handleResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Input validation
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP and new password are required'
            });
        }

        // Find and verify OTP
        const otpDoc = await OTP.findOne({ email });
        if (!otpDoc || otpDoc.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        const updatedAdmin = await Admin.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: otpDoc._id });

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};

module.exports = {
    handleResetPassword
};