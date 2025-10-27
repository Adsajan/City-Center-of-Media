import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', subjects: '' });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { (async () => {
    const { data } = await api.get('/teachers');
    setTeachers(data);
  })(); }, []);

  const create = async (e) => {
    e.preventDefault();
    const payload = { ...form, subjects: form.subjects ? form.subjects.split(',').map(s=>s.trim()).filter(Boolean) : [] };
    const { data } = await api.post('/teachers/full', payload);
    setTeachers(prev => [data, ...prev]);
    setForm({ name: '', email: '', password: '', subjects: '' });
  };

  const del = async (id) => {
    if (!confirm('Delete this teacher and linked user?')) return;
    await api.delete(`/teachers/${id}`);
    setTeachers(prev => prev.filter(t => t._id !== id));
  };
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Teachers</h2>
      </div>

      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Subjects (comma separated)" value={form.subjects} onChange={(e)=>setForm({...form,subjects:e.target.value})} />
        <button className="btn btn-primary" type="submit">Add teacher</button>
      </form>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Subjects</th>
              <th>Courses</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <React.Fragment key={t._id}>
                <tr className="border-b">
                  <td className="py-2">{t.fullName || t.user?.name}</td>
                  <td>{t.user?.email}</td>
                  <td>{t.subjects?.join(', ')}</td>
                  <td>{(t.assignedCourses || []).map(c => (c?.courseCode ? `${c.courseCode} - ` : '') + (c?.courseName || c?.name || '')).filter(Boolean).join(', ')}</td>
                  <td className="text-right space-x-2">
                    <button className="btn btn-outline" onClick={() => setExpandedId(prev => prev === t._id ? null : t._id)}>
                      {expandedId === t._id ? 'Hide Details' : 'View Details'}
                    </button>
                    <button className="btn btn-outline" onClick={()=>del(t._id)}>Delete</button>
                  </td>
                </tr>
                {expandedId === t._id && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={5} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div><span className="text-gray-500">Teacher ID:</span> {t.teacherId || '-'}</div>
                        <div><span className="text-gray-500">Gender:</span> {t.gender || '-'}</div>
                        <div><span className="text-gray-500">DOB:</span> {t.dob ? new Date(t.dob).toLocaleDateString() : '-'}</div>
                        <div><span className="text-gray-500">National ID:</span> {t.nationalId || '-'}</div>
                        <div className="md:col-span-3"><span className="text-gray-500">Address:</span> {t.address || '-'}</div>
                        <div><span className="text-gray-500">Mobile:</span> {t.phoneMobile || '-'}</div>
                        <div><span className="text-gray-500">WhatsApp:</span> {t.phoneWhatsapp || '-'}</div>
                        <div><span className="text-gray-500">Emergency Contact:</span> {t.emergencyContact || '-'}</div>
                        <div className="md:col-span-3 font-medium mt-2">Academic & Professional</div>
                        <div><span className="text-gray-500">Qualification:</span> {t.qualification || '-'}</div>
                        <div><span className="text-gray-500">Specialization:</span> {t.specialization || '-'}</div>
                        <div><span className="text-gray-500">Experience (years):</span> {t.experienceYears ?? '-'}</div>
                        <div className="md:col-span-3"><span className="text-gray-500">Certifications:</span> {(t.certifications || []).join(', ') || '-'}</div>
                        <div className="md:col-span-3"><span className="text-gray-500">Languages:</span> {(t.languageProficiency || []).join(', ') || '-'}</div>
                        <div className="md:col-span-3 font-medium mt-2">Employment</div>
                        <div><span className="text-gray-500">Employee Type:</span> {t.employeeType || '-'}</div>
                        <div><span className="text-gray-500">Join Date:</span> {t.joinDate ? new Date(t.joinDate).toLocaleDateString() : '-'}</div>
                        <div><span className="text-gray-500">Position:</span> {t.position || '-'}</div>
                        <div><span className="text-gray-500">Department:</span> {t.department || '-'}</div>
                        <div><span className="text-gray-500">Academic Year:</span> {t.academicYear || '-'}</div>
                        <div className="md:col-span-3 font-medium mt-2">Payroll</div>
                        <div><span className="text-gray-500">Salary:</span> {t.salary || '-'}</div>
                        <div><span className="text-gray-500">Bank:</span> {t.bankName || '-'}</div>
                        <div><span className="text-gray-500">Account #:</span> {t.accountNumber || '-'}</div>
                        <div><span className="text-gray-500">Payment Status:</span> {t.paymentStatus || '-'}</div>
                        <div className="md:col-span-3 font-medium mt-2">System</div>
                        <div><span className="text-gray-500">Role:</span> {t.role || 'TEACHER'}</div>
                        <div><span className="text-gray-500">Status:</span> {t.status || '-'}</div>
                        <div className="md:col-span-3"><span className="text-gray-500">Assigned Courses:</span> {(t.assignedCourses || []).map(c => (c?.courseCode ? `${c.courseCode} - ` : '') + (c?.courseName || c?.name || '')).filter(Boolean).join(', ') || '-'}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
