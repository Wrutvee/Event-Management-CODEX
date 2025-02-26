export const validateEventForm = (formData, mode) => {
  // mode = true for edit false for create
  const errors = [];
  const now = new Date();

  // Basic Event Information
  if (!formData.title.trim()) errors.push("Event title is required");
  if (!formData.description.trim())
    errors.push("Event description is required");
  if (!formData.category) errors.push("Event category is required");

  // Organizer Details
  if (!formData.organizer.name.trim())
    errors.push("Organizer name is required");
  if (!formData.organizer.email.trim())
    errors.push("Organizer email is required");
  if (!formData.organizer.contact.trim())
    errors.push("Contact number is required");

  // Schedule & Venue
  if (!formData.dateTime.start) {
    errors.push("Start date & time is required");
  } else {
    const startDate = new Date(formData.dateTime.start);
    // Check if start date is in the past
    if (startDate < now) {
      errors.push("Event cannot start in the past");
    }
  }

  if (!formData.dateTime.end) {
    errors.push("End date & time is required");
  }

  // Validate date logic
  if (formData.dateTime.start && formData.dateTime.end) {
    const startDate = new Date(formData.dateTime.start);
    const endDate = new Date(formData.dateTime.end);

    if (endDate <= startDate) {
      errors.push("End date must be after start date");
    }

    // Check registration deadline if registration is required
    if (formData.registration.isRequired && formData.registration.deadline) {
      const regDeadline = new Date(formData.registration.deadline);

      if (regDeadline >= endDate) {
        errors.push("Registration deadline must be before event end date");
      }

      if (regDeadline <= now) {
        errors.push("Registration deadline cannot be in the past");
      }

      if (regDeadline >= startDate) {
        errors.push("Registration deadline must be before event start date");
      }
    }
  }

  // Venue validation
  if (!formData.venue.type) errors.push("Venue type is required");
  if (!formData.venue.details) errors.push("Venue details are required");

  // Rest of your existing validations...
  if (formData.registration.isRequired) {
    if (!formData.registration.deadline) {
      errors.push(
        "Registration deadline is required when registration is enabled"
      );
    }
    if (formData.registration.formFields.length === 0) {
      errors.push("At least one registration form field must be selected");
    }
    if (
      formData.registration.additionalInfo.required &&
      !formData.registration.additionalInfo.question.trim()
    ) {
      errors.push("Additional information question is required when enabled");
    }
  }

  // Capacity Settings
  if (formData.capacity.required && formData.capacity.maxParticipants <= 0) {
    errors.push("Maximum participants must be greater than 0");
  }

  if (formData.capacity.isTeamFormationRequired) {
    if (formData.capacity.minTeamSize <= 0) {
      errors.push("Minimum team size must be greater than 0");
    }
    if (formData.capacity.maxTeamSize <= 0) {
      errors.push("Maximum team size must be greater than 0");
    }
    if (formData.capacity.minTeamSize > formData.capacity.maxTeamSize) {
      errors.push("Minimum team size cannot be greater than maximum team size");
    }
  }

  return errors;
};
