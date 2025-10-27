 import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DemoToolbar() {
  const { demo, setDemoRole, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  if (!demo) return null;

  const setRole = (role) => {
    setDemoRole(role);
    const path = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
    if (!loc.pathname.startsWith(path)) nav(path);
  };

  return (
    <div style={{ position: 'fixed', bottom: 12, right: 12 }} className="shadow-lg">
      <div className="bg-sky-600 text-white rounded-md overflow-hidden">
        <div className="px-3 py-2 text-xs opacity-90">Demo Mode – Current: {user?.role}</div>
        <div className="flex">
          <button className="px-3 py-2 hover:bg-sky-700" onClick={() => setRole('admin')}>Admin</button>
          <button className="px-3 py-2 hover:bg-sky-700" onClick={() => setRole('teacher')}>Teacher</button>
          <button className="px-3 py-2 hover:bg-sky-700" onClick={() => setRole('student')}>Student</button>
        </div>
      </div>
    </div>
  );
}

