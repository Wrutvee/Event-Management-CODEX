const mongoose = require("mongoose");

const FeedbackResponseSchema = new mongoose.Schema(
  {
    question: {
      id: {
        type: mongoose.Schema.Types.ObjectId, // Change to ObjectId since questions have _id
        required: true,
        ref: "Event.feedback.questions", // Reference to the questions in Event model
      },
      text: { type: String, required: true },
      type: {
        type: String,
        enum: ["star", "text", "slider", "choice"],
        required: true,
      },
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const FeedbackSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    responses: [FeedbackResponseSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update compound index
FeedbackSchema.index({ eventId: 1, userId: 1 }, { unique: true });

// Update format responses method
FeedbackSchema.methods.formatResponses = function () {
  return this.responses.reduce((acc, response) => {
    acc[response.question.id.toString()] = {
      text: response.question.text,
      type: response.question.type,
      answer: response.answer,
    };
    return acc;
  }, {});
};

// Update stats method
FeedbackSchema.statics.getEventStats = async function (eventId) {
  const stats = await this.aggregate([
    {
      $match: {
        eventId: mongoose.Types.ObjectId(eventId),
      },
    },
    {
      $unwind: "$responses",
    },
    {
      $group: {
        _id: {
          id: "$responses.question.id",
          text: "$responses.question.text",
          type: "$responses.question.type",
        },
        count: { $sum: 1 },
        avgRating: {
          $avg: {
            $cond: [
              { $in: ["$responses.question.type", ["star", "slider"]] },
              "$responses.answer",
              null,
            ],
          },
        },
        responses: {
          $push: {
            answer: "$responses.answer",
            userId: "$userId",
          },
        },
      },
    },
    {
      $sort: { "_id.id": 1 },
    },
  ]);

  return stats;
};

module.exports = mongoose.model("Feedback", FeedbackSchema);
