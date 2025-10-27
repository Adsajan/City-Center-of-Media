const mongoose = require('mongoose');

const TeacherAttendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'leave'], default: 'present' },
    notes: { type: String },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

TeacherAttendanceSchema.index({ date: 1, teacherId: 1 }, { unique: true });

module.exports = mongoose.model('TeacherAttendance', TeacherAttendanceSchema);

