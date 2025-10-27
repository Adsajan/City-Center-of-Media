const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Student = require('../models/Student');
const User = require('../models/User');

// List students (admin/teacher)
router.get('/', auth, role('admin', 'teacher'), async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const { courseId } = req.query || {};
  let filter = {};
  if (q) filter.$or = [{ rollNo: new RegExp(q, 'i') }];
  if (courseId) filter.courseId = courseId;
  const data = await Student.find(filter).populate('user classId courseId');
  res.json(data);
});

// Create (admin)
router.post('/', auth, role('admin'), async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
});

// Create full: user + student
router.post('/full', auth, role('admin'), async (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, password } = body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      classId: body.classId,
      avatar: body.avatar
    });

  const student = await Student.create({
      user: user._id,
      email: (body.email || '').toLowerCase(),
      classId: body.classId,
      courseId: body.courseId || body.classId, // support both during migration

      // Academic
      admissionNumber: body.admissionNumber || `ADM-${Date.now()}`,
      rollNo: body.rollNo,
      sectionOrBatch: body.sectionOrBatch,
      previousSchool: body.previousSchool,
      admissionDate: body.admissionDate,
      academicYear: body.academicYear,
      term: body.term,

      // Personal
      dob: body.dob,
      gender: body.gender,
      nationalId: body.nationalId,
      phoneMobile: body.phoneMobile,
      phoneWhatsapp: body.phoneWhatsapp,
      address: body.address,

      // Guardian
      guardianName: body.guardianName,
      guardianRelationship: body.guardianRelationship,
      guardianPhone: body.guardianPhone,
      guardianEmail: body.guardianEmail,
      guardianOccupation: body.guardianOccupation,
      guardianAddress: body.guardianAddress
    });

    const populated = await Student.findById(student._id).populate('user classId');
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: 'Create failed' });
  }
});

// Current student profile
router.get('/me', auth, role('student','admin'), async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const me = await Student.findOne({ user: req.user._id }).populate('user classId courseId');
      if (!me) return res.status(404).json({ message: 'Profile not found' });
      return res.json(me);
    }
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required for admin' });
    const s = await Student.findOne({ user: userId }).populate('user classId courseId');
    if (!s) return res.status(404).json({ message: 'Not found' });
    return res.json(s);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load profile' });
  }
});

// Read one
router.get('/:id', auth, role('admin', 'teacher'), async (req, res) => {
  const item = await Student.findById(req.params.id).populate('user classId courseId');
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Update
router.put('/:id', auth, role('admin'), async (req, res) => {
  const payload = { ...req.body };
  // keep email in sync with User if provided
  if (payload.email) payload.email = String(payload.email).toLowerCase();
  const item = await Student.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (req.body?.email && item?.user) {
    await User.findByIdAndUpdate(item.user, { email: payload.email });
  }
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// Delete
router.delete('/:id', auth, role('admin'), async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id);
  if (s?.user) await User.findByIdAndDelete(s.user);
  res.json({ ok: true, deleted: s?._id });
});

module.exports = router;
