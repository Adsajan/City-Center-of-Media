const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const StudentAttendance = require('../models/StudentAttendance');
const TeacherAttendance = require('../models/TeacherAttendance');

// List student attendance
router.get('/students', auth, role('admin', 'teacher'), async (req, res) => {
  const { date, courseId } = req.query;
  const q = {};
  if (date) q.date = date;
  if (courseId) q.courseId = courseId;
  const data = await StudentAttendance.find(q).populate('studentId').populate('courseId');
  res.json(data);
});

// Mark student attendance (bulk upsert)
router.post('/students/mark', auth, role('admin', 'teacher'), async (req, res) => {
  try {
    const { date, courseId, items = [] } = req.body || {};
    if (!date || !courseId || !Array.isArray(items)) return res.status(400).json({ message: 'Missing fields' });
    const results = [];
    for (const it of items) {
      const doc = await StudentAttendance.findOneAndUpdate(
        { date, courseId, studentId: it.studentId },
        { $set: { status: it.status || 'present', notes: it.notes || '', markedBy: req.user._id } },
        { upsert: true, new: true }
      );
      results.push(doc);
    }
    res.json({ ok: true, count: results.length, items: results });
  } catch (e) {
    res.status(500).json({ message: 'Mark failed' });
  }
});

// List teacher attendance (admin only)
router.get('/teachers', auth, role('admin'), async (req, res) => {
  const { date } = req.query;
  const q = {};
  if (date) q.date = date;
  const data = await TeacherAttendance.find(q).populate({ path: 'teacherId', populate: { path: 'user' } });
  res.json(data);
});

// Mark teacher attendance (admin only, bulk upsert)
router.post('/teachers/mark', auth, role('admin'), async (req, res) => {
  try {
    const { date, items = [] } = req.body || {};
    if (!date || !Array.isArray(items)) return res.status(400).json({ message: 'Missing fields' });
    const results = [];
    for (const it of items) {
      const doc = await TeacherAttendance.findOneAndUpdate(
        { date, teacherId: it.teacherId },
        { $set: { status: it.status || 'present', notes: it.notes || '', markedBy: req.user._id } },
        { upsert: true, new: true }
      );
      results.push(doc);
    }
    res.json({ ok: true, count: results.length, items: results });
  } catch (e) {
    res.status(500).json({ message: 'Mark failed' });
  }
});

module.exports = router;

