const crypto = require('crypto');
const Admin = require('../models/Admin');
const InviteCode = require('../models/InviteCode');

const generateInvite = async (req, res) => {
    try {
        const { role, description } = req.body;

        // Validate inputs
        if (!role || !['admin', 'superadmin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        if (!description?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }

        // Only superadmin can create superadmin invites
        if (role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Only superadmins can create superadmin invites'
            });
        }

        // Generate random invite code
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();

        // Create invite
        const invite = new InviteCode({
            code,
            description: description.trim(),
            createdBy: req.user.id,
            roleAssigned: role,
            expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours validity
        });

        await invite.save();

        // Add invite to admin's inviteCodes array
        await Admin.findByIdAndUpdate(
            req.user.id,
            { $push: { inviteCodes: invite._id } }
        );

        res.json({
            success: true,
            code: invite.code,
            expiresAt: invite.expiresAt
        });

    } catch (error) {
        console.error('Generate invite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating invite'
        });
    }
};

const getActiveInvites = async (req, res) => {
    try {
        // Find all non-expired, unused invites created by the current admin
        const invites = await InviteCode.find({
            createdBy: req.user.id,
            used: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            invites
        });

    } catch (error) {
        console.error('Get active invites error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching active invites'
        });
    }
};

const revokeInvite = async (req, res) => {
    try {
        const { code } = req.params;

        const invite = await InviteCode.findOne({ code });

        if (!invite) {
            return res.status(404).json({
                success: false,
                message: 'Invite not found'
            });
        }
        
        // Check if the current admin created this invite
        if (invite.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to revoke this invite'
            });
        }

        // Set expiration to now to invalidate the invite
        invite.expiresAt = new Date();
        await invite.save();

        res.json({
            success: true,
            message: 'Invite revoked successfully'
        });

    } catch (error) {
        console.error('Revoke invite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error revoking invite'
        });
    }
};

module.exports = {
    generateInvite,
    getActiveInvites,
    revokeInvite
};