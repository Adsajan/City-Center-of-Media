import React, { useState } from 'react';
import api from '../../../lib/axios.js';
import Card from '../../../components/ui/Card.jsx';
import DatePicker from '../../../components/ui/DatePicker.jsx';

export default function AdminCoursesAdd() {
  const [form, setForm] = useState({
    courseCode: '', courseName: '', courseType: 'Core', category: '', description: '',
    creditHours: '', duration: '', academicYear: '', termOrSemester: '', level: '',
    instructorId: '', assistantInstructors: '', department: '',
    maxStudents: '', prerequisites: '', schedule: '', location: '', examDate: '',
    courseFee: '', materials: '', status: 'Active'
  });
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault(); setOk(''); setErr('');
    try {
      const payload = {
        ...form,
        creditHours: form.creditHours ? Number(form.creditHours) : undefined,
        maxStudents: form.maxStudents ? Number(form.maxStudents) : undefined,
        assistantInstructors: form.assistantInstructors ? form.assistantInstructors.split(',').map(s=>s.trim()).filter(Boolean) : [],
        prerequisites: form.prerequisites ? form.prerequisites.split(',').map(s=>s.trim()).filter(Boolean) : [],
        materials: form.materials ? form.materials.split('|').map(s=>s.trim()).filter(Boolean) : [],
      };
      const { data } = await api.post('/courses', payload);
      setOk(`Created course: ${data.courseCode} - ${data.courseName}`);
      setForm({ courseCode: '', courseName: '', courseType: 'Core', category: '', description: '', creditHours: '', duration: '', academicYear: '', termOrSemester: '', level: '', instructorId: '', assistantInstructors: '', department: '', maxStudents: '', prerequisites: '', schedule: '', location: '', examDate: '', courseFee: '', materials: '', status: 'Active' });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-3">Add Course</h2>
      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Course Code (e.g. CSC101)" value={form.courseCode} onChange={update('courseCode')} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Course Name" value={form.courseName} onChange={update('courseName')} required />
        <label className="text-sm text-gray-600">Type
          <select className="border rounded px-3 py-2 text-sm w-full" value={form.courseType} onChange={update('courseType')}>
            <option>Core</option>
            <option>Elective</option>
            <option>Optional</option>
          </select>
        </label>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Category / Department" value={form.category} onChange={update('category')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Credit Hours (e.g. 3)" value={form.creditHours} onChange={update('creditHours')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Duration (e.g. 16 weeks)" value={form.duration} onChange={update('duration')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Academic Year (e.g. 2024-2025)" value={form.academicYear} onChange={update('academicYear')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Term / Semester" value={form.termOrSemester} onChange={update('termOrSemester')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Level (e.g. Undergraduate)" value={form.level} onChange={update('level')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Department (e.g. Computer Science)" value={form.department} onChange={update('department')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Max Students" value={form.maxStudents} onChange={update('maxStudents')} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Prerequisites (codes, comma separated)" value={form.prerequisites} onChange={update('prerequisites')} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Assistant Instructor IDs (comma separated)" value={form.assistantInstructors} onChange={update('assistantInstructors')} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Schedule (e.g. Mon & Wed 9-11am)" value={form.schedule} onChange={update('schedule')} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Location / Link" value={form.location} onChange={update('location')} />
        <label className="text-sm text-gray-600">Exam Date
          <DatePicker value={form.examDate} onChange={(v)=>setForm({...form,examDate:v})} />
        </label>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Course Fee (e.g. LKR 12,000)" value={form.courseFee} onChange={update('courseFee')} />
        <textarea className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Description" value={form.description} onChange={update('description')} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Materials (separate with |)" value={form.materials} onChange={update('materials')} />
        <label className="text-sm text-gray-600">Status
          <select className="border rounded px-3 py-2 text-sm w-full" value={form.status} onChange={update('status')}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Archived</option>
          </select>
        </label>
        <div className="md:col-span-2"><button className="btn btn-primary" type="submit">Create</button></div>
      </form>
      {ok && <div className="text-green-600 text-sm mt-2">{ok}</div>}
      {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
    </Card>
  );
}
