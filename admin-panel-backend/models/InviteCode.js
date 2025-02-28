const mongoose = require("mongoose");

const InviteCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 4 * 60 * 60 * 1000),
    }, // 4 hours validity
    used: { type: Boolean, default: false },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    roleAssigned: {
      type: String,
      enum: ["superadmin", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InviteCode", InviteCodeSchema);
