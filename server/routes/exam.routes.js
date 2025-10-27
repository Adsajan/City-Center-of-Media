const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Exam = require('../models/Exam');

router.get('/', auth, role('admin', 'teacher'), async (req, res) => {
  const data = await Exam.find();
  res.json(data);
});

router.post('/', auth, role('admin', 'teacher'), async (req, res) => {
  const item = await Exam.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', auth, role('admin', 'teacher'), async (req, res) => {
  const item = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

module.exports = router;

