const Event = require("../models/Event");

const getPastEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const currentDate = new Date();
        
        // Query past events
        const events = await Event.find({
          visibility: "public",
          "dateTime.end": { $lt: currentDate },
          status: { $ne: "cancelled" },
        })
          .sort({ "dateTime.end": -1 }) // Sort by end date, most recent first
          .skip(skip)
          .limit(limit)
          .populate("organizer.createdBy", "name email")
          .populate("organizer.managedBy", "name email");

        // Get total count for pagination
        const totalEvents = await Event.countDocuments({
          status: { $ne: "cancelled" },
          visibility: "public",
          "dateTime.end": { $lt: currentDate },
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
        console.error('Get past events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching past events'
        });
    }
};

module.exports = {
    getPastEvents
};