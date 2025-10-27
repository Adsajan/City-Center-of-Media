const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

router.get('/', auth, role('admin'), async (req, res) => {
  const data = await Teacher.find().populate('user classIds assignedCourses');
  res.json(data);
});

// Get current teacher profile
router.get('/me', auth, role('teacher','admin'), async (req, res) => {
  if (req.user.role === 'teacher') {
    const me = await Teacher.findOne({ user: req.user._id }).populate('user assignedCourses');
    if (!me) return res.status(404).json({ message: 'Profile not found' });
    return res.json(me);
  }
  // admin fallback (optional query userId)
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId required for admin' });
  const t = await Teacher.findOne({ user: userId }).populate('user assignedCourses');
  if (!t) return res.status(404).json({ message: 'Not found' });
  res.json(t);
});

router.post('/', auth, role('admin'), async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.status(201).json(teacher);
});

// Create full: user + teacher
router.post('/full', auth, role('admin'), async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, role: 'teacher' });

    const payload = { ...req.body, user: user._id };
    // Normalize optional fields
    const clearIfEmpty = (obj, keys) => keys.forEach(k => { if (obj[k] === '' || obj[k] == null) delete obj[k]; });
    clearIfEmpty(payload, [
      'teacherId','gender','dob','nationalId','photo','phoneMobile','phoneWhatsapp','address','emergencyContact',
      'qualification','specialization','employeeType','joinDate','position','department','academicYear',
      'salary','bankName','accountNumber','paymentStatus'
    ]);

    // Dates
    if (typeof payload.dob === 'string') { if (!payload.dob) delete payload.dob; else payload.dob = new Date(payload.dob); }
    if (typeof payload.joinDate === 'string') { if (!payload.joinDate) delete payload.joinDate; else payload.joinDate = new Date(payload.joinDate); }

    // Numbers
    if (payload.experienceYears === '' || payload.experienceYears == null) delete payload.experienceYears;
    else payload.experienceYears = Number(payload.experienceYears);

    // Arrays
    if (typeof payload.subjects === 'string') payload.subjects = payload.subjects.split(',').map(s=>s.trim()).filter(Boolean);
    if (typeof payload.certifications === 'string') payload.certifications = payload.certifications.split(',').map(s=>s.trim()).filter(Boolean);
    if (typeof payload.languageProficiency === 'string') payload.languageProficiency = payload.languageProficiency.split(',').map(s=>s.trim()).filter(Boolean);

    // Course mapping
    if (payload.courseId && !payload.assignedCourses) payload.assignedCourses = [payload.courseId];

    const teacher = await Teacher.create(payload);
    const populated = await Teacher.findById(teacher._id).populate('user classIds assignedCourses');
    res.status(201).json(populated);
  } catch (e) {
    const msg = e?.message || 'Create failed';
    if (/validation/i.test(msg)) return res.status(400).json({ message: msg });
    res.status(500).json({ message: 'Create failed' });
  }
});

router.get('/:id', auth, role('admin', 'teacher'), async (req, res) => {
  const item = await Teacher.findById(req.params.id).populate('user classIds assignedCourses');
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.put('/:id', auth, role('admin'), async (req, res) => {
  const item = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  const t = await Teacher.findByIdAndDelete(req.params.id);
  if (t?.user) await User.findByIdAndDelete(t.user);
  res.json({ ok: true, deleted: t?._id });
});

module.exports = router;
