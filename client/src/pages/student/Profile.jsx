import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';

export default function StudentProfile() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/students/me'); setData(data); }
      catch (e) { setErr('Failed to load profile'); }
    })();
  }, []);

  if (err) return <div>{err}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-6 text-white" style={{background:'linear-gradient(135deg,#059669,#06b6d4)'}}>
        <div className="flex items-center gap-4">
          <img className="h-16 w-16 rounded-full ring-2 ring-white/60" src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(data?.user?.email||'user')}`} />
          <div>
            <div className="text-2xl font-semibold">{data.user?.name}</div>
            <div className="text-white/90">{data.user?.email}</div>
            <div className="text-sm text-white/80">{data.courseId?.courseCode ? `${data.courseId.courseCode} - ` : ''}{data.courseId?.courseName || data.courseId?.name || 'Course'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><div className="text-sm text-gray-500">Admission No</div><div className="font-medium">{data.admissionNumber || '-'}</div></Card>
        <Card><div className="text-sm text-gray-500">Roll No</div><div className="font-medium">{data.rollNo || '-'}</div></Card>
        <Card><div className="text-sm text-gray-500">Section/Batch</div><div className="font-medium">{data.sectionOrBatch || '-'}</div></Card>
      </div>

      <Card>
        <div className="text-lg font-semibold mb-3">Personal</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><span className="text-gray-500">DOB:</span> {data.dob ? new Date(data.dob).toLocaleDateString() : '-'}</div>
          <div><span className="text-gray-500">Gender:</span> {data.gender || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Address:</span> {data.address || '-'}</div>
        </div>
      </Card>

      <Card>
        <div className="text-lg font-semibold mb-3">Guardian</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><span className="text-gray-500">Name:</span> {data.guardianName || '-'}</div>
          <div><span className="text-gray-500">Phone:</span> {data.guardianPhone || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Email:</span> {data.guardianEmail || '-'}</div>
        </div>
      </Card>
    </div>
  );
}

