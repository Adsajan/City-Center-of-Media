import React, { useEffect, useMemo, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../ui/Card.jsx';
import DatePicker from '../ui/DatePicker.jsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select.jsx';

const statuses = ['present','absent','late','excused'];

export default function StudentAttendanceEditor({ mode = 'admin', allowedCourseIds }) {
  const [date, setDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // studentId -> status
  const [loading, setLoading] = useState(false);

  useEffect(() => { (async () => {
    try {
      const { data } = await api.get('/courses');
      const list = Array.isArray(allowedCourseIds) ? data.filter(c => allowedCourseIds.includes(c._id)) : data;
      setCourses(list);
    } catch {}
  })(); }, [allowedCourseIds?.length]);

  const load = async () => {
    if (!courseId || !date) return;
    setLoading(true);
    try {
      const [stuRes, attRes] = await Promise.all([
        api.get('/students', { params: { courseId } }),
        api.get('/attendance/students', { params: { date, courseId } }),
      ]);
      setStudents(stuRes.data || []);
      const m = {};
      (attRes.data || []).forEach(a => { m[a.studentId] = a.status; });
      setMarks(m);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [courseId, date]);

  const change = (studentId, status) => setMarks(prev => ({ ...prev, [studentId]: status }));

  const save = async () => {
    if (!courseId || !date) return alert('Pick date and course');
    const items = students.map(s => ({ studentId: s._id, status: marks[s._id] || 'present' }));
    await api.post('/attendance/students/mark', { date, courseId, items });
    alert('Attendance saved');
    load();
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Date</div>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Course</div>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="min-w-[220px]"><SelectValue placeholder="Select course" /></SelectTrigger>
            <SelectContent>
              {courses.map(c => (
                <SelectItem key={c._id} value={c._id}>{(c.courseCode?`${c.courseCode} - `:'') + (c.courseName||'Untitled')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Roll</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id} className="border-b">
                  <td className="py-2">{s.user?.name}</td>
                  <td>{s.user?.email}</td>
                  <td>{s.rollNo || ''}</td>
                  <td>
                    <select className="border rounded px-2 py-1 text-sm" value={marks[s._id] || 'present'} onChange={(e)=>change(s._id, e.target.value)}>
                      {statuses.map(st => (<option key={st} value={st}>{st}</option>))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

