const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  coverPhoto: {
    type: String
  },
  mediaLinks: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    _id: false
  }],
  category: { 
    type: String, 
    required: true 
  },
  tags: [String],
  organizer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true }
  },
  venue: {
    type: { 
      type: String, 
      enum: ["online", "offline"], 
      required: true 
    },
    details: String
  },
  dateTime: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    durationInHours: Number
  },
  registration: {
    isRequired: { type: Boolean, default: false },
    formFields: [{
      id: { type: String, required: true },
      label: { type: String, required: true },
      required: { type: Boolean, default: false }
    }],
    additionalInfo: {
      required: { type: Boolean, default: false },
      question: String
    },
    fee: { type: Number, default: 0 },
    deadline: Date
  },
  capacity: {
    required: { type: Boolean, default: false },
    maxParticipants: { type: Number, default: 0 },
    isTeamFormationRequired: { type: Boolean, default: false },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 1 }
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },
  status: {
    type: String,
    enum: ["cancelled", "running"],
    default: "running"
  },
  feedback: {
    isEnabled: { type: Boolean, default: false },
    questions: [{
      text: { type: String },
      type: {
        type: String,
        enum: ["star", "text", "slider", "choice"]
      },
      options: [String],
      required: { type: Boolean, default: true },
      order: { type: Number }
    }]
  }
}, {
  timestamps: true
});

// Add index for better query performance
EventSchema.index({ "dateTime.start": 1 });
EventSchema.index({ "dateTime.end": 1 });
EventSchema.index({ visibility: 1 });
EventSchema.index({ status: 1 });

// Virtual for checking if event is full
EventSchema.virtual('isFull').get(function() {
  if (!this.capacity.required) return false;
  return this.registeredUsers.length >= this.capacity.maxParticipants;
});

// Method to check if registration is open
EventSchema.methods.isRegistrationOpen = function() {
  if (!this.registration.isRequired) return true;
  if (!this.registration.deadline) return true;
  return new Date() < new Date(this.registration.deadline);
};

module.exports = mongoose.model('Event', EventSchema);