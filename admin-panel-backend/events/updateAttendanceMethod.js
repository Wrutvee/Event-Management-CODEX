const Event = require('../models/Event');

async function updateAttendanceMethod (req, res) {
  try {
    const { eventId } = req.params;
    const updateField = Object.keys(req.body)[0]; // isRequired, qrCheckin, or manualCheckin
    const value = req.body[updateField];

    // Validate the field name
    const validFields = ['isRequired', 'qrCheckin', 'manualCheckin'];
    if (!validFields.includes(updateField)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attendance field'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to update the event
    const canUpdate = 
      req.user.role === 'superadmin' || 
      event.organizer.createdBy.toString() === req.user.id.toString() || 
      event.organizer.managedBy.includes(req.user.id.toString());

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update attendance settings'
      });
    }

    // Update attendance settings
    if (!event.attendance) {
      event.attendance = {};
    }

    event.attendance[updateField] = value;

    // If turning off isRequired, disable both qrCheckin and manualCheckin
    if (updateField === 'isRequired' && !value) {
      event.attendance.qrCheckin = false;
      event.attendance.manualCheckin = false;
    }

    // If enabling either qrCheckin or manualCheckin, set isRequired to true
    if ((updateField === 'qrCheckin' || updateField === 'manualCheckin') && value) {
      event.attendance.isRequired = true;
    }

    // If disabling both qrCheckin and manualCheckin, set isRequired to false
    if ((updateField === 'qrCheckin' || updateField === 'manualCheckin') && !value) {
      const otherField = updateField === 'qrCheckin' ? 'manualCheckin' : 'qrCheckin';
      if (!event.attendance[otherField]) {
        event.attendance.isRequired = false;
      }
    }

    await event.save();

    res.json({
      success: true,
      message: 'Attendance settings updated successfully',
      attendance: event.attendance
    });

  } catch (error) {
    console.error('Update attendance mode error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance settings'
    });
  }
};

module.exports = { updateAttendanceMethod };