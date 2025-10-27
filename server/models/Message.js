const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    room: String, // e.g., class room or private room key
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);

