const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Which chat room does this message belong to?
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    
    // Who sent it?
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // What did they say?
    content: { type: String, required: true, trim: true },
    
    // Did the other person see it?
    seen: { type: Boolean, default: false },
    
    // Users who have read this message.
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

// This index lets us fetch messages in chronological order (newest first)
messageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);