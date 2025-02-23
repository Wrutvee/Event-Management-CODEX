const express = require('express');
const router = express.Router();
const { createEvent } = require('../events/createEvent');
const { getMyEvents } = require('../events/getMyEvents');
const { getUpcomingEvents } = require('../events/getUpcomingEvents');
const { getPastEvents } = require('../events/getPastEvents');
const { getAllEvents } = require('../events/getAllEvents')
const { verifyToken } = require('../auth/verify');

router.post('/create', verifyToken, createEvent);
router.get('/get-my-events', verifyToken, getMyEvents);
router.get('/get-upcoming', getUpcomingEvents);
router.get('/get-past', getPastEvents);
router.get(
  "/get-all-events",
  (req, res, next) => {
    // Optional authentication
    if (req.cookies.token) {
      verifyToken(req, res, next);
    } else {
      next();
    }
  }, getAllEvents
);

module.exports = router;