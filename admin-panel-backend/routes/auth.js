const express = require('express');
const router = express.Router();
const { handleSignin } = require('../auth/signIn');
const { handleSignup } = require("../auth/signUp");
const { generateOtp } = require("../auth/passwordReset/generateOtp");
const { handleResetPassword } = require("../auth/passwordReset/newPassword");
const { verifyToken } = require("../auth/verify");
const { handleLogout } = require("../auth/logout");

router.post("/signin", handleSignin);
router.post("/signup", handleSignup);
router.post("/reset-password", generateOtp);
router.post("/reset-password/verify", handleResetPassword);
router.get("/verify", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
router.post("/logout", handleLogout);

module.exports = router;