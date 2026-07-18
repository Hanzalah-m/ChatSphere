const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    // Exactly two people in a chat room, never more, never less.
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ],
    // Saves the very last message so we can show a preview in the sidebar without fetching all messages
    latestMessage: {
      text: { type: String, default: "" },
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// This index makes searching for a chat between two specific users incredibly fast.
chatSchema.index({ members: 1 });

module.exports = mongoose.model("Chat", chatSchema);