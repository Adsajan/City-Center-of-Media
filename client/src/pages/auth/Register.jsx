import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-xl font-semibold mb-4">Register</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select className="w-full border rounded p-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn btn-primary w-full" type="submit">Create account</button>
        </form>
        <div className="text-sm text-gray-600 mt-3">Have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
      </div>
    </div>
  );
}
