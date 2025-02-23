const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/verify');
const Event = require('../models/Event');

router.post('/create', verifyToken, async (req, res) => {
    try {
        const eventData = req.body;
        
        // Add creator to organizer
        eventData.organizer.createdBy = req.user.id;
        
        // Convert managedBy emails to Admin IDs
        if (eventData.organizer.managedBy && eventData.organizer.managedBy.length > 0) {
            const Admin = require('../models/Admin');
            const adminEmails = eventData.organizer.managedBy;
            const admins = await Admin.find({ email: { $in: adminEmails } });
            eventData.organizer.managedBy = admins.map(admin => admin._id);
        }

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: event
        });
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event'
        });
    }
});

module.exports = router;