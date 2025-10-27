import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import KpiCard from '../../components/ui/KpiCard.jsx';
import ChatPanel from '../../modules/chat/ChatPanel.jsx';

export default function TeacherDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || 'Teacher'}</h1>
        <p className="text-sm text-gray-500">Manage your classes, attendance and marks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Today’s Classes" value="3" hint={<a className="underline" href="/teacher/timetable">View timetable →</a>} />
        <KpiCard title="Pending Attendance" value="1" hint={<a className="underline" href="/teacher/attendance">Mark attendance →</a>} />
        <KpiCard title="Assignments" value="2" hint={<a className="underline" href="/teacher/marks">Enter marks →</a>} />
      </div>

      <ChatPanel room="teachers" from={user?.name || 'Teacher'} />
    </div>
  );
}
