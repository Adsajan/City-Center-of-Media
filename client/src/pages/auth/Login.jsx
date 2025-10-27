import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/ui/Input.jsx';
import Label from '../../components/ui/Label.jsx';
import Separator from '../../components/ui/Separator.jsx';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
      const dest = map[role] || '/';
      const from = location.state?.from?.pathname;
      navigate(from || dest);
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[80vh] grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* Left visual panel */}
      <div className="hidden md:flex relative items-end justify-start p-8 bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400 text-white">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0, transparent 30%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.25) 0, transparent 35%)'}} />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-md bg-white/20 flex items-center justify-center font-bold">CCM</div>
            <div className="font-semibold text-white/90">City Center of Media</div>
          </div>
          <h2 className="text-3xl font-semibold leading-tight">Welcome back</h2>
          <p className="mt-2 text-white/90">Sign in to manage classes, students, fees and more with a modern daCCMboard experience.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="p-6 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Enter your email and password to continue</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label className="mb-1 block text-gray-700 dark:text-gray-300">Email</Label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="pl-9" required />
              </div>
            </div>

            <div>
              <Label className="mb-1 block text-gray-700 dark:text-gray-300">Role</Label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pl-3 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-gray-700 dark:text-gray-300">Password</Label>
                <button type="button" onClick={() => alert('Please contact administrator')} className="text-xs text-sky-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10V8a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} className="pl-9" required />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button className="w-full btn btn-primary" type="submit">Sign in</button>

            {/* Social sign-in removed by request */}
            <Separator className="mt-2" />
          </form>

          <p className="text-sm text-gray-600 mt-6">
            Don’t have an account?{' '}
            <Link className="text-sky-600 hover:underline" to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

