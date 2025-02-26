const express = require('express');
const router = express.Router();
const { createEvent } = require('../events/createEvent');
const { getMyEvents } = require('../events/getMyEvents');
const { getUpcomingEvents } = require('../events/getUpcomingEvents');
const { getPastEvents } = require('../events/getPastEvents');
const { getAllEvents } = require('../events/getAllEvents');
const { getEventById } = require("../events/getEventById");
const { updateEvent } = require("../events/updateEvent");
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

router.get(
  "/:eventId",
  (req, res, next) => {
    // Optional authentication for private events
    if (req.cookies.token) {
      verifyToken(req, res, next);
    } else {
      next();
    }
  },
  getEventById
);

router.put("/update/:eventId", verifyToken, updateEvent);

module.exports = router;