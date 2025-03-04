const Event = require('../models/Event');
const User = require('../models/User');

const markAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, checkInMethod } = req.body;
    const adminId = req.user.id; // Get the admin ID from the token

    if (!userId || !checkInMethod) {
      return res.status(400).json({
        success: false,
        message: 'User ID and check-in method are required'
      });
    }

    // Find event and check if attendance is enabled
    const event = await Event.findById(eventId)
      .populate('organizer.createdBy', '_id')
      .populate('organizer.managedBy', '_id');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if admin has permission to mark attendance
    const canMarkAttendance = 
      req.user.role === 'superadmin' || 
      event.organizer.createdBy._id.toString() === adminId.toString() ||
      event.organizer.managedBy.some(manager => manager._id.toString() === adminId.toString());

    if (!canMarkAttendance) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance for this event'
      });
    }

    // Validate check-in method
    if (!['qr', 'manual'].includes(checkInMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in method'
      });
    }

    // Check if attendance tracking is enabled
    if (!event.attendance[`${checkInMethod}Checkin`]) {
      return res.status(400).json({
        success: false,
        message: `${checkInMethod} check-in is not enabled for this event`
      });
    }

    // Check if user is registered for the event
    if (!event.registeredUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered for this event'
      });
    }

    // Update user's attendance record
    const result = await User.findOneAndUpdate(
      { 
        _id: userId,
        'registeredEvents.eventId': eventId
      },
      {
        $set: {
          'registeredEvents.$.attendance.isAttended': true,
          'registeredEvents.$.attendance.checkinTime': new Date(),
          'registeredEvents.$.attendance.checkInMethod': checkInMethod
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found or not registered for this event'
      });
    }

    // Add to event's attendees list if not already present
    const alreadyCheckedIn = event.attendees.some(
      attendee => attendee.userId.toString() === userId
    );

    if (!alreadyCheckedIn) {
      event.attendees.push({
        userId,
        checkInTime: new Date(),
        checkInMethod
      });
      await event.save();
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      checkInTime: new Date()
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance'
    });
  }
};

module.exports = { markAttendance };