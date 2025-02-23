const Event = require("../models/Event");

const getUpcomingEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const currentDate = new Date();

        // Query upcoming events
        const events = await Event.find({
          visibility: "public",
          "dateTime.start": { $gt: currentDate }, // Event starts in the future
          status: { $ne: "cancelled" },
        })
          .sort({ "dateTime.start": 1 }) // Sort by start date, soonest first
          .skip(skip)
          .limit(limit)
          .populate("organizer.createdBy", "name email")
          .populate("organizer.managedBy", "name email");

        // Get total count for pagination
        const totalEvents = await Event.countDocuments({
          visibility: "public",
          status: "upcoming",
          "dateTime.start": { $gt: currentDate },
          status: { $ne: "cancelled" },
        });

        res.json({
            success: true,
            events,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalEvents,
                hasMore: skip + events.length < totalEvents
            }
        });

    } catch (error) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming events'
        });
    }
};

module.exports = {
    getUpcomingEvents
};