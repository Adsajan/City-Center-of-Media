import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';

export default function TeacherProfile() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/teachers/me'); setData(data); }
      catch (e) { setErr('Failed to load profile'); }
    })();
  }, []);

  if (err) return <div>{err}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-6 text-white" style={{background:'linear-gradient(135deg,#1d4ed8,#a78bfa)'}}>
        <div className="flex items-center gap-4">
          <img className="h-16 w-16 rounded-full ring-2 ring-white/60" src={`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(data?.user?.email||'user')}`} />
          <div>
            <div className="text-2xl font-semibold">{data.fullName || data.user?.name}</div>
            <div className="text-white/90">{data.user?.email}</div>
            <div className="text-sm text-white/80">{data.position || 'Teacher'} • {data.department || 'Department'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><div className="text-sm text-gray-500">Qualification</div><div className="font-medium">{data.qualification || '-'}</div></Card>
        <Card><div className="text-sm text-gray-500">Specialization</div><div className="font-medium">{data.specialization || '-'}</div></Card>
        <Card><div className="text-sm text-gray-500">Experience</div><div className="font-medium">{data.experienceYears ?? '-'} years</div></Card>
      </div>

      <Card>
        <div className="text-lg font-semibold mb-3">Teaching</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><span className="text-gray-500">Subjects:</span> {data.subjects?.join(', ') || '-'}</div>
          <div><span className="text-gray-500">Courses:</span> {(data.assignedCourses||[]).map(c => (c?.courseCode?`${c.courseCode} - `:'')+(c?.courseName||c?.name||'')).join(', ') || '-'}</div>
          <div><span className="text-gray-500">Employee Type:</span> {data.employeeType || '-'}</div>
          <div><span className="text-gray-500">Join Date:</span> {data.joinDate ? new Date(data.joinDate).toLocaleDateString() : '-'}</div>
        </div>
      </Card>
    </div>
  );
}

