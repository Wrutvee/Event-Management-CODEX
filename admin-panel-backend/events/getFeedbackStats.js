const Event = require('../models/Event');
const Feedback = require('../models/Feedback');

const getFeedbackStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("feedback.questions");

    // Get all feedback for this event
    const feedbacks = await Feedback.find({ eventId });

    // Initialize stats object
    const stats = {
      totalResponses: feedbacks.length,
      questions: {},
    };

    // Process each question
    event.feedback.questions.forEach((question) => {
      const responses = feedbacks.flatMap((f) =>
        f.responses.filter(
          (r) => r.question.id.toString() === question._id.toString()
        )
      );

      switch (question.type) {
        case "star":
        case "slider":
          stats.questions[question._id] = {
            type: question.type,
            text: question.text,
            avgRating:
              responses.reduce((sum, r) => sum + r.answer, 0) /
                responses.length || 0,
            totalResponses: responses.length,
          };
          break;

        case "choice":
          const optionCounts = {};
          question.options.forEach((opt) => (optionCounts[opt] = 0));
          responses.forEach((r) => {
            if (optionCounts.hasOwnProperty(r.answer)) {
              optionCounts[r.answer]++;
            }
          });
          stats.questions[question._id] = {
            type: question.type,
            text: question.text,
            options: Object.entries(optionCounts).map(([option, count]) => ({
              option,
              count,
              percentage: (count / responses.length) * 100,
            })),
            totalResponses: responses.length,
          };
          break;

        case "text":
          stats.questions[question._id] = {
            type: question.type,
            text: question.text,
            responses: responses.map((r) => r.answer),
            totalResponses: responses.length,
          };
          break;
      }
    });

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Feedback stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching feedback stats",
    });
  }
};

module.exports = { getFeedbackStats };