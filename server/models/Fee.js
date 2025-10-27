const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
    dueDate: Date,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', FeeSchema);

