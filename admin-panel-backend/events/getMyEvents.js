const Event = require("../models/Event");

const getMyEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Query events where admin is either creator or manager
        const events = await Event.find({
          $or: [
            { "organizer.createdBy": req.user.id },
            { "organizer.managedBy": req.user.id },
          ],
          status: { $ne: "cancelled" },
        })
          .sort({ createdAt: -1 }) // Sort by newest first
          .skip(skip)
          .limit(limit)
          .populate("organizer.createdBy", "name email")
          .populate("organizer.managedBy", "name email");

        // Get total count for pagination
        const totalEvents = await Event.countDocuments({
          $or: [
            { "organizer.createdBy": req.user.id },
            { "organizer.managedBy": req.user.id },
          ],
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
        console.error('Get my events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events'
        });
    }
};

module.exports = {
    getMyEvents
};