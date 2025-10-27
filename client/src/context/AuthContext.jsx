import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const envDemo = (import.meta.env.VITE_DEMO_MODE === 'true');
  const [demoEnabled, setDemoEnabled] = useState(envDemo || localStorage.getItem('demoMode') === 'true');

  const demoUserFromLS = () => {
    const role = localStorage.getItem('demoRole') || 'admin';
    const name = `Demo ${role.charAt(0).toUpperCase()}${role.slice(1)}`;
    const email = `${role}@demo.local`;
    return { id: 'demo', name, email, role };
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (token) {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } else if (demoEnabled) {
          setUser(demoUserFromLS());
        } else {
          setUser(null);
        }
      } catch (e) {
        if (demoEnabled) setUser(demoUserFromLS()); else setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token, demoEnabled]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(demoEnabled ? demoUserFromLS() : null);
  };

  const setDemoRole = (role) => {
    localStorage.setItem('demoRole', role);
    if (demoEnabled) setUser(demoUserFromLS());
  };

  const enableDemo = () => { localStorage.setItem('demoMode', 'true'); setDemoEnabled(true); setUser(demoUserFromLS()); };
  const disableDemo = () => { localStorage.removeItem('demoMode'); setDemoEnabled(envDemo); if (!envDemo) setUser(null); };

  const value = { token, user, loading, login, register, logout, setDemoRole, demo: demoEnabled, enableDemo, disableDemo };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
