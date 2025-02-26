const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverPhoto: { type: String }, // Add this new field
    mediaLinks: [
      {
        url: String,
        type: String,
      },
    ],
    resources: [
      {
        name: String,
        link: String,
      },
    ],
    category: { type: String, required: true },
    tags: [String],
    organizer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      contact: { type: String, required: true },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
      },
      managedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    },
    venue: {
      type: { type: String, enum: ["online", "offline"], required: true },
      details: String,
    },
    dateTime: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      durationInHours: Number,
    },
    registration: {
      isRequired: { type: Boolean, default: false },
      formFields: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          required: { type: Boolean, default: false },
        },
      ],
      additionalInfo: {
        required: { type: Boolean, default: false },
        question: String,
      },
      fee: { type: Number, default: 0 },
      deadline: Date,
    },
    capacity: {
      required: { type: Boolean, default: false },
      maxParticipants: { type: Number, default: 0 },
      isTeamFormationRequired: { type: Boolean, default: false },
      minTeamSize: { type: Number, default: 1 },
      maxTeamSize: { type: Number, default: 1 },
    },
    attendance: {
      isRequired: { type: Boolean, default: false },
      qrCheckin: { type: Boolean, default: false },
      manualCheckin: { type: Boolean, default: false },
    },
    promotionLinks: {
      instagram: String,
      twitter: String,
      website: String,
    },
    certificates: {
      willItBeProvided: { type: Boolean, default: false },
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["cancelled", "running"],
      default: "running",
    },
    isFeedbackEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate duration and update status
EventSchema.pre('save', function(next) {
    const now = new Date();
    
    // Calculate duration
    if (this.dateTime.start && this.dateTime.end) {
        const duration = (new Date(this.dateTime.end) - new Date(this.dateTime.start)) / (1000 * 60 * 60);
        this.dateTime.durationInHours = Math.round(duration * 100) / 100;
    }
    
    // Set attendance.isRequired
    this.attendance.isRequired = this.attendance.qrCheckin || this.attendance.manualCheckin;
    
    next();
});

module.exports = mongoose.model('Event', EventSchema);