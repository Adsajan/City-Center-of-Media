import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/axios.js';
import Card from '../../../components/ui/Card.jsx';

export default function AdminCoursesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/courses', { params: { q } });
        setItems(data);
      } finally { setLoading(false); }
    };
    load();
  }, [q]);

  const del = async (id) => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}`);
    setItems((prev) => prev.filter((x) => x._id !== id));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="flex items-center gap-2">
          <input className="border rounded px-3 py-2 text-sm" placeholder="Search code/name..." value={q} onChange={(e)=>setQ(e.target.value)} />
          <Link to="/admin/courses/add" className="btn btn-primary">Add Course</Link>
        </div>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Credits</th>
                <th>Duration</th>
                <th>Year</th>
                <th>Term</th>
                <th>Level</th>
                <th>Department</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id} className="border-b">
                  <td className="py-2">{c.courseCode}</td>
                  <td>{c.courseName}</td>
                  <td>{c.courseType}</td>
                  <td>{c.category}</td>
                  <td>{c.creditHours || ''}</td>
                  <td>{c.duration || ''}</td>
                  <td>{c.academicYear || ''}</td>
                  <td>{c.termOrSemester || ''}</td>
                  <td>{c.level || ''}</td>
                  <td>{c.department || ''}</td>
                  <td>{c.status}</td>
                  <td className="text-right">
                    <button className="btn btn-outline" onClick={() => del(c._id)}>Delete</button>
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

