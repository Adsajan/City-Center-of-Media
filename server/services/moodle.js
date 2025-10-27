// Placeholder Moodle service. Replace with real Moodle Web Service calls.
module.exports = {
  async syncUsers() {
    return { ok: true, message: 'Users synced (placeholder)' };
  },
  async syncCourses() {
    return { ok: true, message: 'Courses synced (placeholder)' };
  },
  async enrollUser(userId, courseId) {
    return { ok: true, message: `Enrolled ${userId} to ${courseId} (placeholder)` };
  },
  async fetchGrades(userId) {
    return { ok: true, userId, grades: [] };
  }
};

