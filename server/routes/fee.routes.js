const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Fee = require('../models/Fee');

router.get('/', auth, role('admin'), async (req, res) => {
  const data = await Fee.find().populate('studentId');
  res.json(data);
});

router.post('/', auth, role('admin'), async (req, res) => {
  const item = await Fee.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', auth, role('admin'), async (req, res) => {
  const item = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

module.exports = router;

