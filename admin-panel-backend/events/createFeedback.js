const { validateFeedback } = require('./validation');
const Event = require("../models/Event");

const createFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { feedback } = req.body;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions
    const canEdit = 
      req.user.role === 'superadmin' || 
      event.organizer.createdBy.toString() === req.user.id.toString() ||
      event.organizer.managedBy.includes(req.user.id);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this event'
      });
    }

    // Validate feedback data
    const validationErrors = validateFeedback(feedback);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Update event feedback
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { feedback },
      { new: true, runValidators: true }
    ).populate("organizer.createdBy", "name email")
     .populate("organizer.managedBy", "name email");

    res.json({
      success: true,
      message: 'Feedback settings updated successfully',
      event: updatedEvent
    });

  } catch (error) {
    console.error('Feedback update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating feedback settings'
    });
  }
};

module.exports = { createFeedback };