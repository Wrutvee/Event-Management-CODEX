const Event = require("../models/Event");

const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find event and populate organizer details
        const event = await Event.findById(eventId)
            .populate("organizer.createdBy", "name email")
            .populate("organizer.managedBy", "name email");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // If event is private, check if user is authorized
        if (event.visibility === "private") {
            // Allow if user is authenticated and is either creator or manager
            if (!req.user || (
                event.organizer.createdBy._id.toString() !== req.user.id &&
                !event.organizer.managedBy.some(admin => admin._id.toString() === req.user.id)
            )) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to view this event"
                });
            }
        }

        res.json({
            success: true,
            event
        });

    } catch (error) {
        console.error('Get event by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching event details'
        });
    }
};

module.exports = {
    getEventById
};