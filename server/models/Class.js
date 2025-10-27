const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    section: String,
    subjects: [String],
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', ClassSchema);

