import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ShadDashboardLayout from '../components/shadcn/dashboard/Layout.jsx';
import AppShell from '../components/dashboard/AppShell.jsx';

function SidebarLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`block rounded-md px-3 py-2 text-sm ${active ? 'bg-[var(--brand-100)] text-[var(--brand-700)] dark:bg-[var(--brand-900)] dark:text-[var(--brand-200)]' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
    >
      {label}
    </Link>
  );
}

function SidebarGroup({ title, children }) {
  return (
    <div className="mb-4">
      <div className="px-3 pb-1 text-xs uppercase tracking-wider text-gray-500">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();

  // Apply role theme via CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-admin', 'theme-teacher', 'theme-student');
    const cls = role ? `theme-${role}` : user?.role ? `theme-${user.role}` : 'theme-student';
    root.classList.add(cls);
  }, [role, user?.role]);

  const roleNow = role || user?.role || 'student';
  const items = roleNow === 'admin' ? [
    { title: 'Overview', links: [ { to: '/admin', label: 'Dashboard' } ] },
    { title: 'Courses', links: [ { to: '/admin/courses/add', label: 'Add Course' }, { to: '/admin/courses', label: 'View Courses' } ] },
    { title: 'Students', links: [ { to: '/admin/students/add', label: 'Add Student' }, { to: '/admin/students', label: 'View Students' } ] },
    { title: 'Teachers', links: [ { to: '/admin/teachers/add', label: 'Add Teacher' }, { to: '/admin/teachers', label: 'View Teachers' } ] },
    { title: 'Academics', links: [ { to: '/admin/exams', label: 'Exams' }, { to: '/admin/fees', label: 'Fees' }, { to: '/admin/timetable', label: 'Timetable' } ] },
    { title: 'Attendance', links: [ { to: '/admin/attendance/students', label: 'Students' }, { to: '/admin/attendance/teachers', label: 'Teachers' } ] },
  ] : roleNow === 'teacher' ? [
    { title: 'Overview', links: [ { to: '/teacher', label: 'Dashboard' } ] },
    { title: 'Classroom', links: [ { to: '/teacher/attendance', label: 'Attendance' }, { to: '/teacher/timetable', label: 'Timetable' }, { to: '/teacher/marks', label: 'Marks' } ] },
  ] : [
    { title: 'Overview', links: [ { to: '/student', label: 'Dashboard' } ] },
    { title: 'My Info', links: [ { to: '/student/timetable', label: 'Timetable' }, { to: '/student/results', label: 'Results' }, { to: '/student/fees', label: 'Fees' } ] },
  ];

  const sections = items.map((g) => ({ title: g.title, links: g.links }));
  const title = (roleNow || '').toUpperCase() + ' Dashboard';

  return (
    <AppShell sidebarItems={sections} title={title} user={user} onLogout={logout} role={roleNow}>
      {children}
    </AppShell>
  );
}
