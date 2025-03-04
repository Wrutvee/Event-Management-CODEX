const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/verify');
const Event = require("../models/Event");
const User = require("../models/User"); 
const Feedback = require('../models/Feedback');

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
        "dateTime.start": { $lt: currentDate },
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
        "dateTime.start": { $lt: currentDate },
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
          "dateTime.start": { $lt: currentDate },
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

// Register for event
router.post('/:eventId/register', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const registrationData = req.body;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed'
      });
    }

    // Check if event is full
    if (event.isFull) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Validate required fields
    if (event.registration.isRequired) {
      const missingFields = event.registration.formFields
        .filter(field => field.required && !registrationData[field.id])
        .map(field => field.label);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      if (event.registration.additionalInfo.required && !registrationData.additionalInfo) {
        return res.status(400).json({
          success: false,
          message: 'Additional information is required'
        });
      }
    }

    // Register user
    event.registeredUsers.push(userId);
    await event.save();

    // Structure registration data
    const formattedRegistrationData = {
      formFields: event.registration.formFields.reduce((acc, field) => {
        acc[field.id] = {
          question: field.label,
          answer: registrationData[field.id] || ''
        };
        return acc;
      }, {}),
      additionalInfo: event.registration.additionalInfo.required ? {
        question: event.registration.additionalInfo.question,
        answer: registrationData.additionalInfo
      } : null
    };

    // Add registration to user's profile
    await User.findByIdAndUpdate(userId, {
      $push: {
        registeredEvents: {
          eventId: event._id,
          registrationDate: new Date(),
          formResponses: formattedRegistrationData
        }
      }
    });

    res.json({
      success: true,
      message: 'Successfully registered for the event'
    });

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event'
    });
  }
});

// Add feedback submission route
router.post('/:eventId/feedback', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { responses } = req.body;

    // Validate event exists and feedback is enabled
    const event = await Event.findOne({
      _id: eventId,
      'feedback.isEnabled': true,
      registeredUsers: userId
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or feedback not enabled'
      });
    }

    // Validate all questions exist and responses are valid
    const questionMap = new Map(
      event.feedback.questions.map(q => [q._id.toString(), q])
    );

    // Validate responses
    for (const response of responses) {
      const question = questionMap.get(response.question.id);
      if (!question) {
        return res.status(400).json({
          success: false,
          message: `Invalid question ID: ${response.question.id}`
        });
      }

      // Type-specific validation
      switch (question.type) {
        case 'star':
          if (!Number.isInteger(response.answer) || response.answer < 1 || response.answer > 5) {
            return res.status(400).json({
              success: false,
              message: `Invalid star rating for question: ${question.text}`
            });
          }
          break;

        case 'slider':
          if (!Number.isInteger(response.answer) || response.answer < 1 || response.answer > 10) {
            return res.status(400).json({
              success: false,
              message: `Invalid slider value for question: ${question.text}`
            });
          }
          break;

        case 'choice':
          if (!question.options.includes(response.answer)) {
            return res.status(400).json({
              success: false,
              message: `Invalid choice for question: ${question.text}`
            });
          }
          break;

        case 'text':
          if (typeof response.answer !== 'string' || !response.answer.trim()) {
            return res.status(400).json({
              success: false,
              message: `Invalid text response for question: ${question.text}`
            });
          }
          break;
      }
    }

    // Check for existing feedback
    const existingFeedback = await Feedback.findOne({
      eventId,
      userId
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this event'
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      eventId,
      userId,
      responses: responses.map(response => ({
        question: {
          id: response.question.id,
          text: response.question.text,
          type: response.question.type
        },
        answer: response.answer
      }))
    });

    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: feedback.formatResponses()
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting feedback'
    });
  }
});

// Helper function to validate answers
function validateAnswer(answer, type) {
  switch (type) {
    case 'star':
      if (!Number.isInteger(answer) || answer < 1 || answer > 5) {
        return {
          isValid: false,
          message: 'Star rating must be between 1 and 5'
        };
      }
      break;

    case 'slider':
      if (!Number.isInteger(answer) || answer < 1 || answer > 10) {
        return {
          isValid: false,
          message: 'Slider value must be between 1 and 10'
        };
      }
      break;

    case 'text':
      if (typeof answer !== 'string' || !answer.trim()) {
        return {
          isValid: false,
          message: 'Text answer cannot be empty'
        };
      }
      break;

    case 'choice':
      if (typeof answer !== 'string' || !answer.trim()) {
        return {
          isValid: false,
          message: 'Choice must be selected'
        };
      }
      break;

    default:
      return {
        isValid: false,
        message: 'Invalid question type'
      };
  }

  return { isValid: true };
}

module.exports = router;