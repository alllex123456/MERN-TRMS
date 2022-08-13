import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MainLayout } from './components/layout/MainLayout';
import { QueuePage } from './pages/queue';
import { ClientsPage } from './pages/clients';
import { StatementsPage } from './pages/statements';
import { StatisticsPage } from './pages/statistics';
import { ProfilePage } from './pages/profile';
import { SettingsPage } from './pages/settings';
import { Dashboard } from './pages/dashboard.js';

import { AuthContext } from './context/auth-context';

import Auth from './components/auth/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {!isLoggedIn && (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      )}
      {isLoggedIn && (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/statements" element={<StatementsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </MainLayout>
      )}
    </AuthContext.Provider>
  );
}

export default App;
