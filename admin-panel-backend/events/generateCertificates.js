const Event = require('../models/Event');
const User = require('../models/User');
const workerManager = require('../utils/workerManager');

const generateCertificates = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { users } = req.body;

    // Validate request
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No users provided for certificate generation'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Start certificate generation using worker manager
    workerManager.generateCertificates({
      eventId: event._id.toString(),
      eventName: event.title,
      eventDate: event.dateTime.start,
    }, users).catch(error => {
      console.error('Certificate generation error:', error);
    });

    res.json({
      success: true,
      message: 'Certificate generation initiated'
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating certificate generation'
    });
  }
};

module.exports = { generateCertificates };