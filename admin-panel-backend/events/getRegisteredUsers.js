const User = require("../models/User");
const Event = require("../models/Event");

async function getRegisteredUsers(req, res) {
  try {
    const { eventId } = req.params;

    // Find event and populate registered users
    const event = await Event.findById(eventId).populate("registeredUsers");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check permissions
    const canView =
      req.user.role === "superadmin" ||
      event.organizer.createdBy.toString() === req.user.id.toString() ||
      event.organizer.managedBy.includes(req.user.id.toString());

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view registrations",
      });
    }

    // Get detailed registration info for each user
    const registrations = await User.find({
      "registeredEvents.eventId": eventId,
    }).select("name email registeredEvents.$");

    // Format data for response
    const formattedRegistrations = registrations.map((user) => {
      const registration = user.registeredEvents.find(
        (reg) => reg.eventId.toString() === eventId
      );

      // Convert Map to regular object for formFields
      const formFields = registration.formResponses?.formFields
        ? Object.fromEntries(registration.formResponses.formFields)
        : {};

      return {
        name: user.name,
        email: user.email,
        registrationDate: registration.registrationDate,
        formResponses: {
          ...formFields,
          additionalInfo: registration.formResponses?.additionalInfo,
        },
      };
    });

    res.json({
      success: true,
      registrations: formattedRegistrations,
      totalRegistrations: formattedRegistrations.length,
      event: {
        title: event.title,
        maxCapacity: event.capacity.maxParticipants,
        registrationFields: event.registration.formFields,
        additionalInfo: event.registration.additionalInfo,
      },
    });
  } catch (error) {
    console.error("Fetch registrations detail error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching registration details",
    });
  }
}


module.exports = { getRegisteredUsers };