const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const emailService = require('../utils/emailService');
let smsService;
try { smsService = require('../utils/smsService'); } catch { smsService = { async send() { return true; } }; }

// List with optional filters
router.get('/', auth, role('admin', 'teacher'), async (req, res) => {
  const { courseId, teacherId, day } = req.query;
  const q = {};
  if (courseId) q.courseId = courseId;
  if (teacherId) q.teacherId = teacherId;
  if (day !== undefined) q.day = Number(day);
  const data = await Timetable.find(q).sort({ day: 1, startTime: 1 })
    .populate('courseId')
    .populate({ path: 'teacherId', populate: { path: 'user' } });
  res.json(data);
});

// Student: get my timetable (by student's courseId)
router.get('/student', auth, role('student'), async (req, res) => {
  const me = await Student.findOne({ user: req.user._id });
  if (!me || !me.courseId) return res.json([]);
  const data = await Timetable.find({ courseId: me.courseId }).sort({ day: 1, startTime: 1 })
    .populate('courseId')
    .populate({ path: 'teacherId', populate: { path: 'user' } });
  res.json(data);
});

// Create
router.post('/', auth, role('admin', 'teacher'), async (req, res) => {
  const body = { ...req.body };
  if (req.user.role === 'teacher') {
    const t = await Teacher.findOne({ user: req.user._id });
    if (!t) return res.status(400).json({ message: 'Teacher profile not found' });
    body.teacherId = t._id;
  }
  try {
    const item = await Timetable.create(body);
    const populated = await Timetable.findById(item._id)
      .populate('courseId')
      .populate({ path: 'teacherId', populate: { path: 'user' } });
    res.status(201).json(populated);
  } catch (e) {
    res.status(400).json({ message: 'Create failed' });
  }
});

// Update
router.put('/:id', auth, role('admin', 'teacher'), async (req, res) => {
  const body = { ...req.body };
  if (req.user.role === 'teacher') {
    const t = await Teacher.findOne({ user: req.user._id });
    if (!t) return res.status(400).json({ message: 'Teacher profile not found' });
    body.teacherId = t._id;
  }
  const item = await Timetable.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.populate('courseId');
  await item.populate({ path: 'teacherId', populate: { path: 'user' } });
  res.json(item);
});

// Delete
router.delete('/:id', auth, role('admin', 'teacher'), async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Notify students enrolled in the course for a timetable slot
router.post('/:id/notify', auth, role('admin','teacher'), async (req, res) => {
  const { message, channels = ['email'] } = req.body || {};
  const slot = await Timetable.findById(req.params.id).populate('courseId').populate({ path: 'teacherId', populate: { path: 'user' } });
  if (!slot) return res.status(404).json({ message: 'Timetable slot not found' });

  // Find recipients: students with the courseId
  const students = await Student.find({ courseId: slot.courseId?._id }).populate('user');
  const subject = `Class Reminder: ${slot.courseId?.courseCode || ''} ${slot.title || slot.courseId?.courseName || ''}`.trim();

  let emailCount = 0, smsCount = 0;
  const msg = message && message.trim().length ? message.trim() :
    `Reminder: ${slot.title || slot.courseId?.courseName} on day ${slot.day}, ${slot.startTime}-${slot.endTime} at ${slot.location || 'classroom'}.`;

  for (const s of students) {
    const email = s.user?.email;
    const phone = s.phoneMobile || s.phoneWhatsapp;
    if (channels.includes('email') && email) {
      try { await emailService.send(email, subject, msg); emailCount++; } catch {}
    }
    if (channels.includes('sms') && phone && smsService?.send) {
      try { await smsService.send(phone, msg); smsCount++; } catch {}
    }
  }

  res.json({ ok: true, recipients: students.length, emailSent: emailCount, smsSent: smsCount });
});

module.exports = router;
