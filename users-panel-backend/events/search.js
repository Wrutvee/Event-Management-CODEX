const Event = require('../models/Event');

const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query must be at least 3 characters long' 
      });
    }

    // Using MongoDB text search
    // Note: You need to create a text index on relevant fields in your Event model
    // Example: Event.createIndex({ title: 'text', description: 'text', location: 'text' })
    const events = await Event.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(20);

    return res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while searching for events'
    });
  }
};

module.exports = searchEvents;