const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'present' },
    notes: { type: String },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

StudentAttendanceSchema.index({ date: 1, courseId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('StudentAttendance', StudentAttendanceSchema);

