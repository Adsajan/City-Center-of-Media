import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import KpiCard from '../../components/ui/KpiCard.jsx';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hi {user?.name || 'Student'} 👋</h1>
        <p className="text-sm text-gray-500">Here’s what’s next for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Next Class" value="Math – 10:30" hint={<a className="underline" href="/student/timetable">View timetable →</a>} />
        <KpiCard title="Outstanding Fees" value="$0" hint={<a className="underline" href="/student/fees">View fees →</a>} />
        <KpiCard title="Latest Result" value="A-" hint={<a className="underline" href="/student/results">View results →</a>} />
      </div>
    </div>
  );
}
