const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Course = require('../models/Course');

// List courses
router.get('/', auth, role('admin', 'teacher'), async (req, res) => {
  const q = (req.query.q || '').trim();
  const filter = q
    ? { $or: [{ courseCode: new RegExp(q, 'i') }, { courseName: new RegExp(q, 'i') }] }
    : {};
  const data = await Course.find(filter).populate('instructorId assistantInstructors');
  res.json(data);
});

// Create course
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.instructorId === '' || payload.instructorId === null) delete payload.instructorId;
    if (payload.examDate === '' || payload.examDate === null) delete payload.examDate;
    if (Array.isArray(payload.assistantInstructors)) {
      payload.assistantInstructors = payload.assistantInstructors.filter(Boolean);
    } else if (payload.assistantInstructors === '' || payload.assistantInstructors == null) {
      payload.assistantInstructors = [];
    }

    const item = await Course.create(payload);
    res.status(201).json(item);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Course code already exists' });
    }
    res.status(400).json({ message: err.message || 'Failed to create course' });
  }
});

// Read one
router.get('/:id', auth, role('admin', 'teacher'), async (req, res) => {
  const item = await Course.findById(req.params.id).populate('instructorId assistantInstructors enrolledStudents');
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Update
router.put('/:id', auth, role('admin'), async (req, res) => {
  const item = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Delete
router.delete('/:id', auth, role('admin'), async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
