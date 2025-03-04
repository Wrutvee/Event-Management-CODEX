const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    profilePic: {
      type: String,
      default: null,
    },
    registeredEvents: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Event",
        },
        registrationDate: {
          type: Date,
          default: Date.now,
        },
        formResponses: {
          formFields: {
            type: Map,
            of: new mongoose.Schema(
              {
                question: String,
                answer: String,
              },
              { _id: false }
            ),
          },
          additionalInfo: {
            question: String,
            answer: String,
          },
        },
        attendance: {
          isAttended: {
            type: Boolean,
            default: false,
          },
          checkinTime: {
            type: Date,
          },
          checkInMethod: {
            type: String,
            enum: ['qr', 'manual']
          }
        }
      },
      { _id : false }
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);