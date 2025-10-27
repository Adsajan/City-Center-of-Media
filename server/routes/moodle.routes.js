const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const moodle = require('../services/moodle');

router.post('/sync-users', auth, role('admin'), async (req, res) => {
  const result = await moodle.syncUsers();
  res.json(result);
});

router.post('/sync-courses', auth, role('admin'), async (req, res) => {
  const result = await moodle.syncCourses();
  res.json(result);
});

router.post('/enroll', auth, role('admin'), async (req, res) => {
  const { userId, courseId } = req.body;
  const result = await moodle.enrollUser(userId, courseId);
  res.json(result);
});

router.get('/grades/:userId', auth, role('admin', 'teacher'), async (req, res) => {
  const result = await moodle.fetchGrades(req.params.userId);
  res.json(result);
});

module.exports = router;

