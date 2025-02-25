const express = require('express');
const router = express.Router();
const { verifyToken } = require("../auth/verify");
const {
  generateInvite,
  getActiveInvites,
  revokeInvite,
} = require("../inviteAdmins/inviteAdmins");

router.post("/generate-invite", verifyToken, generateInvite);
router.get("/active-invites", verifyToken, getActiveInvites);
router.delete("/revoke-invite/:code", verifyToken, revokeInvite);

module.exports = router;