const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
  {
    // System & access
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, default: 'TEACHER' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },

    // Basic Information
    teacherId: { type: String, trim: true, unique: false },
    fullName: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    dob: { type: Date },
    nationalId: { type: String, trim: true },
    photo: { type: String, trim: true },

    // Contact
    phoneMobile: { type: String, trim: true },
    phoneWhatsapp: { type: String, trim: true },
    address: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },

    // Academic & Professional
    qualification: { type: String, trim: true },
    specialization: { type: String, trim: true },
    experienceYears: { type: Number },
    certifications: [{ type: String }],
    languageProficiency: [{ type: String }],

    // Employment
    employeeType: { type: String, enum: ['Full-Time', 'Part-Time', 'Visiting'], default: 'Full-Time' },
    joinDate: { type: Date },
    position: { type: String, trim: true },
    department: { type: String, trim: true },
    academicYear: { type: String, trim: true },

    // Teaching assignments
    subjects: [String],
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

    // Salary / payroll (optional)
    salary: { type: String, trim: true },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    paymentStatus: { type: String, enum: ['Active', 'On Leave', 'Retired'], default: 'Active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', TeacherSchema);
