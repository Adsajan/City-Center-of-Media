const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ClassModel = require('../models/Class');

router.get('/', auth, role('admin', 'teacher'), async (req, res) => {
  const data = await ClassModel.find();
  res.json(data);
});

router.post('/', auth, role('admin'), async (req, res) => {
  const item = await ClassModel.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', auth, role('admin'), async (req, res) => {
  const item = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  await ClassModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

