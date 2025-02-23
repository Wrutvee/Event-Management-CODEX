const Event = require("../models/Event");

const getAllEvents = async (req, res) => {
    try {
        const currentDate = new Date();
        const limit = 5;
        let response = {
            success: true,
            upcoming: { events: [], total: 0 },
            past: { events: [], total: 0 }
        };

        // Get upcoming events
        const upcomingEvents = await Event.find({
          visibility: "public",
          "dateTime.start": { $gt: currentDate },
           status: { $ne: "cancelled" },
        })
          .sort({ "dateTime.start": 1 })
          .limit(limit)
          .populate("organizer.createdBy", "name email")
          .populate("organizer.managedBy", "name email");

        const totalUpcoming = await Event.countDocuments({
          visibility: "public",
          "dateTime.start": { $gt: currentDate },
           status: { $ne: "cancelled" },
        });

        // Get past events
        const pastEvents = await Event.find({
          visibility: "public",
          "dateTime.end": { $lt: currentDate },
          status: { $ne: "cancelled" },
        })
          .sort({ "dateTime.end": -1 })
          .limit(limit)
          .populate("organizer.createdBy", "name email")
          .populate("organizer.managedBy", "name email");

        const totalPast = await Event.countDocuments({
          visibility: "public",
          "dateTime.end": { $lt: currentDate },
          status: { $ne: "cancelled" },
        });

        response.upcoming = {
            events: upcomingEvents,
            total: totalUpcoming,
            hasMore: totalUpcoming > limit
        };

        response.past = {
            events: pastEvents,
            total: totalPast,
            hasMore: totalPast > limit
        };

        // If user is authenticated, get their events
        if (req.user) {
            const myEvents = await Event.find({
              $or: [
                { "organizer.createdBy": req.user.id },
                { "organizer.managedBy": req.user.id },
              ],
              status: { $ne: "cancelled" },
            })
              .sort({ createdAt: -1 })
              .limit(limit)
              .populate("organizer.createdBy", "name email")
              .populate("organizer.managedBy", "name email");

            const totalMyEvents = await Event.countDocuments({
              $or: [
                { "organizer.createdBy": req.user.id },
                { "organizer.managedBy": req.user.id },
              ],
              status: { $ne: "cancelled" },
            });

            response.myEvents = {
                events: myEvents,
                total: totalMyEvents,
                hasMore: totalMyEvents > limit
            };
        }

        res.json(response);

    } catch (error) {
        console.error('Get events overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events overview'
        });
    }
};

module.exports = {
    getAllEvents
};