import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const fmt = (d) => {
    try {
      if (!d) return '';
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return '';
      return dt.toLocaleDateString();
    } catch { return ''; }
  };
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/students', { params: { q } });
        setStudents(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q]);

  const del = async (id) => {
    if (!confirm('Delete this student and linked user?')) return;
    await api.delete(`/students/${id}`);
    setStudents((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Students</h2>
        <div className="flex items-center gap-2">
          <input className="border rounded px-3 py-2 text-sm" placeholder="Search by roll no..." value={q} onChange={(e)=>setQ(e.target.value)} />
          <Link to="/admin/students/add" className="btn btn-primary">Add Student</Link>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th>Roll No</th>
                <th>Courses</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <React.Fragment key={s._id}>
                  <tr className="border-b">
                    <td className="py-2">{s.user?.name}</td>
                    <td>{s.rollNo || ''}</td>
                    <td>{s.courseId?.courseCode ? `${s.courseId.courseCode} - ` : ""}{s.courseId?.courseName || s.courseId?.name || ""}{s.sectionOrBatch ? ` - ${s.sectionOrBatch}` : ""}</td>
                    <td className="text-right space-x-2">
                      <button
                        className="btn btn-outline"
                        onClick={() => setExpandedId((prev) => (prev === s._id ? null : s._id))}
                      >
                        {expandedId === s._id ? 'Hide Details' : 'View Details'}
                      </button>
                      <button className="btn btn-outline" onClick={() => del(s._id)}>Delete</button>
                    </td>
                  </tr>
                  {expandedId === s._id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={4} className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div><span className="text-gray-500">Email:</span> {s.user?.email || ''}</div>
                          <div><span className="text-gray-500">Admission No:</span> {s.admissionNumber || ''}</div>
                          <div><span className="text-gray-500">Admission Date:</span> {fmt(s.admissionDate)}</div>
                          <div><span className="text-gray-500">Academic Year:</span> {s.academicYear || ''}</div>
                          <div><span className="text-gray-500">Term:</span> {s.term || ''}</div>
                          <div><span className="text-gray-500">DOB:</span> {fmt(s.dob)}</div>
                          <div><span className="text-gray-500">Gender:</span> {s.gender || ''}</div>
                          <div><span className="text-gray-500">Mobile:</span> {s.phoneMobile || ''}</div>
                          <div><span className="text-gray-500">WhatsApp:</span> {s.phoneWhatsapp || ''}</div>
                          <div className="md:col-span-3"><span className="text-gray-500">Address:</span> {s.address || ''}</div>
                          <div className="md:col-span-3 font-medium mt-2">Guardian</div>
                          <div><span className="text-gray-500">Name:</span> {s.guardianName || ''}</div>
                          <div><span className="text-gray-500">Phone:</span> {s.guardianPhone || ''}</div>
                          <div><span className="text-gray-500">Email:</span> {s.guardianEmail || ''}</div>
                          <div className="md:col-span-3"><span className="text-gray-500">Occupation:</span> {s.guardianOccupation || ''}</div>
                          <div className="md:col-span-3"><span className="text-gray-500">Address:</span> {s.guardianAddress || ''}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}


