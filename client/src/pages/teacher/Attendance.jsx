import React, { useEffect, useState } from 'react';
import TimetableEditor from '../../components/timetable/Editor.jsx';
import StudentAttendanceEditor from '../../components/attendance/StudentEditor.jsx';
import api from '../../lib/axios.js';

export default function TeacherAttendance() {
  const [courseIds, setCourseIds] = useState([]);
  useEffect(() => { (async () => {
    try { const { data } = await api.get('/teachers/me'); setCourseIds((data?.assignedCourses||[]).map(c=>c._id)); } catch {}
  })(); }, []);
  return (
    <StudentAttendanceEditor mode="teacher" allowedCourseIds={courseIds} />
  );
}
