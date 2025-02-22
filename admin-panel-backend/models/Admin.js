const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    profilePic: { type: String, default: "" },
    role: { type: String, enum: ["superadmin", "admin"], required: true },
    inviteCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "InviteCode" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
