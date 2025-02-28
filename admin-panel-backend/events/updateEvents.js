const Event = require("../models/Event");
const { validateEventInput } = require("./validation");

const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updateData = req.body;

        // Find event first to check start time
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event has already started
        const now = new Date();
        const eventStartDate = new Date(event.dateTime.start);
        if (eventStartDate <= now) {
            return res.status(403).json({
                success: false,
                message: 'Cannot edit an event that has already started'
            });
        }

        // Validate input with edit mode
        const validationErrors = validateEventInput(updateData, 'edit');
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Check if user has permission to edit
        const canEdit = 
            req.user.role === 'superadmin' || 
            event.organizer.createdBy.toString() === req.user.id ||
            event.organizer.managedBy.includes(req.user.id);

        if (!canEdit) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to edit this event'
            });
        }

        // Convert managedBy emails to Admin IDs if present
        if (updateData.organizer?.managedBy?.length > 0) {
            const Admin = require("../models/Admin");
            const adminEmails = updateData.organizer.managedBy;
            const admins = await Admin.find({ email: { $in: adminEmails } });
            updateData.organizer.managedBy = admins.map(admin => admin._id);
        }

        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            updateData,
            { new: true, runValidators: true }
        ).populate("organizer.createdBy", "name email")
         .populate("organizer.managedBy", "name email");

        res.json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (error) {
        console.error('Event update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event'
        });
    }
};

module.exports = {
    updateEvent
};