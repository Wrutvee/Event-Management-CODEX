const validateEventInput = (eventData, mode = 'create') => {
    const errors = [];
    const now = new Date();

    // Add cover photo validation if needed
    if (eventData.coverPhoto && typeof eventData.coverPhoto !== 'string') {
        errors.push("Cover photo must be a valid URL");
    }

    // Check if event has started when editing
    if (mode === 'edit') {
        const startDate = new Date(eventData.dateTime.start);
        if (startDate <= now) {
            errors.push("Cannot edit an event that has already started");
        }
    }

    // Basic Event Information
    if (!eventData.title?.trim()) errors.push("Event title is required");
    if (!eventData.description?.trim()) errors.push("Event description is required");
    if (!eventData.category) errors.push("Event category is required");

    // Organizer Details
    if (!eventData.organizer?.name?.trim()) errors.push("Organizer name is required");
    if (!eventData.organizer?.email?.trim()) errors.push("Organizer email is required");
    if (!eventData.organizer?.contact?.trim()) errors.push("Contact number is required");

    // Schedule & Venue
    if (!eventData.dateTime?.start) {
        errors.push("Start date & time is required");
    } else {
        const startDate = new Date(eventData.dateTime.start);
        if (startDate < now) {
            errors.push("Event cannot start in the past");
        }
    }

    if (!eventData.dateTime?.end) {
        errors.push("End date & time is required");
    }

    // Validate date logic
    if (eventData.dateTime?.start && eventData.dateTime?.end) {
        const startDate = new Date(eventData.dateTime.start);
        const endDate = new Date(eventData.dateTime.end);
        
        if (endDate <= startDate) {
            errors.push("End date must be after start date");
        }

        if (eventData.registration?.isRequired && eventData.registration?.deadline) {
            const regDeadline = new Date(eventData.registration.deadline);
            
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
    if (!eventData.venue?.type) errors.push("Venue type is required");
    if (!eventData.venue?.details) errors.push("Venue details are required");

    // Registration validation
    if (eventData.registration?.isRequired) {
        if (!eventData.registration?.deadline) {
            errors.push("Registration deadline is required when registration is enabled");
        }
        if (!eventData.registration?.formFields?.length) {
            errors.push("At least one registration form field must be selected");
        }
        if (eventData.registration?.additionalInfo?.required && 
            !eventData.registration?.additionalInfo?.question?.trim()) {
            errors.push("Additional information question is required when enabled");
        }
    }

    // Capacity Settings
    if (eventData.capacity?.required && eventData.capacity?.maxParticipants <= 0) {
        errors.push("Maximum participants must be greater than 0");
    }

    if (eventData.capacity?.isTeamFormationRequired) {
        if (eventData.capacity?.minTeamSize <= 0) {
            errors.push("Minimum team size must be greater than 0");
        }
        if (eventData.capacity?.maxTeamSize <= 0) {
            errors.push("Maximum team size must be greater than 0");
        }
        if (eventData.capacity?.minTeamSize > eventData.capacity?.maxTeamSize) {
            errors.push("Minimum team size cannot be greater than maximum team size");
        }
    }

    return errors;
};

module.exports = { validateEventInput };