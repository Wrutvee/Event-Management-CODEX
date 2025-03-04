// admin-panel-backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  registeredEvents: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    formResponses: {
      formFields: {
        type: Map,
        of: new mongoose.Schema({
          question: String,
          answer: String
        }, { _id: false })
      },
      additionalInfo: {
        question: String,
        answer: String
      }
    },
    attendance: {
      isAttended: {
        type: Boolean,
        default: false
      },
      checkinTime: {
        type: Date
      },
      checkInMethod: {
        type: String,
        enum: ['qr', 'manual']
      }
    }
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);