const express = require('express');
const router = express.Router();
const { createEvent } = require('../events/createEvent');
const { getMyEvents } = require('../events/getMyEvents');
const { getUpcomingEvents } = require('../events/getUpcomingEvents');
const { getPastEvents } = require('../events/getPastEvents');
const { getAllEvents } = require('../events/getAllEvents');
const { getEventById } = require("../events/getEventById");
const { updateEvent } = require("../events/updateEvents");
const { verifyToken } = require('../auth/verify');
const { createFeedback } = require('../events/createFeedback');
const { getRegisteredUsers } = require('../events/getRegisteredUsers');
const { updateAttendanceMethod } = require('../events/updateAttendanceMethod');
const { markAttendance } = require('../events/markAttendance');

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

router.put('/:eventId/feedback', verifyToken, createFeedback);

router.put("/update/:eventId", verifyToken, updateEvent);

router.get("/:eventId/registered-users", verifyToken, getRegisteredUsers);

router.put('/:eventId/update-attendance-mode', verifyToken, updateAttendanceMethod);

router.post('/:eventId/mark-attendance', verifyToken, markAttendance);

module.exports = router;