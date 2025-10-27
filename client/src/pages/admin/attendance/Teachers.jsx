import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios.js';
import Card from '../../../components/ui/Card.jsx';
import DatePicker from '../../../components/ui/DatePicker.jsx';

const statuses = ['present','absent','late','leave'];

export default function AdminAttendanceTeachers() {
  const [date, setDate] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const [tRes, aRes] = await Promise.all([
        api.get('/teachers'),
        api.get('/attendance/teachers', { params: { date } })
      ]);
      setTeachers(tRes.data || []);
      const m = {}; (aRes.data||[]).forEach(x => { m[x.teacherId] = x.status; }); setMarks(m);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [date]);

  const change = (teacherId, status) => setMarks(prev => ({ ...prev, [teacherId]: status }));
  const save = async () => {
    const items = teachers.map(t => ({ teacherId: t._id, status: marks[t._id] || 'present' }));
    await api.post('/attendance/teachers/mark', { date, items });
    alert('Saved');
    load();
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Date</div>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t._id} className="border-b">
                  <td className="py-2">{t.user?.name}</td>
                  <td>{t.user?.email}</td>
                  <td>
                    <select className="border rounded px-2 py-1 text-sm" value={marks[t._id] || 'present'} onChange={(e)=>change(t._id, e.target.value)}>
                      {statuses.map(s => (<option key={s} value={s}>{s}</option>))}
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

