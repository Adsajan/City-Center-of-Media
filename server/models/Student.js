const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Denormalized for convenience (source of truth is User.email)
    email: { type: String, lowercase: true, trim: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },

    // Academic
    admissionNumber: String,
    rollNo: String,
    sectionOrBatch: String,
    previousSchool: String,
    admissionDate: Date,
    academicYear: String,
    term: String,

    // Personal
    dob: Date,
    gender: String,
    nationalId: String,
    phoneMobile: String,
    phoneWhatsapp: String,
    address: String,

    // Guardian
    guardianName: String,
    guardianRelationship: String,
    guardianPhone: String,
    guardianEmail: String,
    guardianOccupation: String,
    guardianAddress: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
