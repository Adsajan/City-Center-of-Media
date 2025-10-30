import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import RoutesApp from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <ThemeProvider storageKey="theme">
      <BrowserRouter>
        <AuthProvider>
          <RoutesApp />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

