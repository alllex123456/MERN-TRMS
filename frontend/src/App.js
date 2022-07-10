import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { MainLayout } from './components/layout/MainLayout';
import { QueuePage } from './pages/queue';
import { ClientsPage } from './pages/clients';
import { StatementsPage } from './pages/statements';
import { StatisticsPage } from './pages/statistics';
import { ProfilePage } from './pages/profile';
import { SettingsPage } from './pages/settings';

function App() {
  return (
    <React.Fragment>
      <MainLayout>
        <Routes>
          <Route path="/" element={<QueuePage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/statements" element={<StatementsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </React.Fragment>
  );
}

export default App;
