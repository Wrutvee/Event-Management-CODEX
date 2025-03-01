const Event = require("../models/Event");
const { validateEventInput } = require("./validation");

const createEvent = async (req, res) => {
    try {
        const eventData = req.body;

        // Validate input
        const validationErrors = validateEventInput(eventData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Ensure mediaLinks is an array of objects with url and type
        if (eventData.mediaLinks) {
            eventData.mediaLinks = eventData.mediaLinks.map(media => ({
                url: media.url,
                type: media.type
            }));
        }

        // Add creator to organizer
        eventData.organizer.createdBy = req.user.id;

        // Convert managedBy emails to Admin IDs
        if (eventData.organizer.managedBy?.length > 0) {
            const Admin = require("../models/Admin");
            const adminEmails = eventData.organizer.managedBy;
            const admins = await Admin.find({ email: { $in: adminEmails } });
            eventData.organizer.managedBy = admins.map(admin => admin._id);
        }

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: event
        });
    } catch (error) {
        console.error("Event creation error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error creating event"
        });
    }
};

module.exports = {
    createEvent
};