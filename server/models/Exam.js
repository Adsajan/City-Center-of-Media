const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    term: String,
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    date: Date,
    results: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        subject: String,
        marks: Number,
        maxMarks: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', ExamSchema);

