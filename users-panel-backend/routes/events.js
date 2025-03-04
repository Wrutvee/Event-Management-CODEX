const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/verify');
const Event = require("../models/Event");

// Get all events (10 each category)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const limit = 10;
    const currentDate = new Date();

    const [upcoming, past, my] = await Promise.all([
      // Get upcoming events
      Event.find({
        "dateTime.start": { $gt: currentDate },
        visibility: "public",
        status: { $ne: "cancelled" }
      })
        .sort({ "dateTime.start": 1 })
        .limit(limit),

      // Get past events
      Event.find({
        "dateTime.end": { $lt: currentDate },
        visibility: "public",
        status: { $ne: "cancelled" }
      })
        .sort({ "dateTime.end": -1 })
        .limit(limit),

      // Get my events if user is authenticated
      req.user ? Event.find({
        "registeredUsers": req.user.id,
        status: { $ne: "cancelled" }
      })
        .sort({ "dateTime.start": 1 })
        .limit(limit) : []
    ]);

    // Get total counts
    const [totalUpcoming, totalPast, totalMy] = await Promise.all([
      Event.countDocuments({
        "dateTime.start": { $gt: currentDate },
        visibility: "public",
        status: { $ne: "cancelled" }
      }),
      Event.countDocuments({
        "dateTime.end": { $lt: currentDate },
        visibility: "public",
        status: { $ne: "cancelled" }
      }),
      req.user ? Event.countDocuments({
        "registeredUsers": req.user.id,
        status: { $ne: "cancelled" }
      }) : 0
    ]);

    res.json({
      success: true,
      upcoming: {
        events: upcoming || [],
        total: totalUpcoming,
        hasMore: totalUpcoming > limit
      },
      past: {
        events: past || [],
        total: totalPast,
        hasMore: totalPast > limit
      },
      my: {
        events: my || [],
        total: totalMy,
        hasMore: totalMy > limit
      }
    });

  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
});

// Get paginated events for specific categories
router.get('/:category', verifyToken, async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const currentDate = new Date();

    let query = {};
    let sort = {};

    switch (category) {
      case 'upcoming':
        query = {
          "dateTime.start": { $gt: currentDate },
          visibility: "public",
          status: { $ne: "cancelled" }
        };
        sort = { "dateTime.start": 1 };
        break;

      case 'past':
        query = {
          "dateTime.end": { $lt: currentDate },
          visibility: "public",
          status: { $ne: "cancelled" }
        };
        sort = { "dateTime.end": -1 };
        break;

      case 'my':
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }
        query = {
          "registeredUsers": req.user.id,
          status: { $ne: "cancelled" }
        };
        sort = { "dateTime.start": 1 };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
    }

    const [events, totalEvents] = await Promise.all([
      Event.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Event.countDocuments(query)
    ]);

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
    console.error(`Get ${req.params.category} events error:`, error);
    res.status(500).json({
      success: false,
      message: `Error fetching ${req.params.category} events`
    });
  }
});

// Get event by ID
router.get('/event/:eventId', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id; // Get user ID if authenticated

    const event = await Event.findOne({ 
      _id: eventId,
       visibility: "public",
      status: { $ne: "cancelled" }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is registered for this event
    const isRegistered = userId ? event.registeredUsers.includes(userId) : false;

    // Check if event is full
    const isEventFull = event.capacity.required && 
      event.registeredUsers.length >= event.capacity.maxParticipants;

    // Check if registration is open
    const isRegistrationOpen = event.registration.isRequired ? 
      new Date() < new Date(event.registration.deadline) : true;

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        isRegistered,
        isEventFull,
        isRegistrationOpen
      }
    });

  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event details'
    });
  }
});

module.exports = router;