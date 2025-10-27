const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    // Basic Information
    courseCode: { type: String, required: true, unique: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    courseType: { type: String, enum: ['Core', 'Elective', 'Optional'], default: 'Core' },
    category: { type: String, trim: true },
    description: { type: String, trim: true },

    // Academic Details
    creditHours: { type: Number },
    duration: { type: String }, // e.g., "16 weeks"
    academicYear: { type: String },
    termOrSemester: { type: String },
    level: { type: String }, // e.g., Undergraduate, Grade 10

    // Instructor Details
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    assistantInstructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    department: { type: String },

    // Student Details
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    maxStudents: { type: Number },
    prerequisites: [{ type: String }], // list of course codes

    // Scheduling & Management
    schedule: { type: String },
    location: { type: String },
    examDate: { type: Date },

    // Fees & Resources (optional)
    courseFee: { type: String },
    materials: [{ type: String }],

    // System Fields
    status: { type: String, enum: ['Active', 'Inactive', 'Archived'], default: 'Active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);

