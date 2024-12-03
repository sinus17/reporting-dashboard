import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AppRoutes } from './routes';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const path = window.location.pathname;
  const isSharedView = path.startsWith('/shared/') || path.startsWith('/tiktok/callback');

  if (isSharedView) {
    return (
      <Router>
        <AppRoutes isSharedView />
      </Router>
    );
  }

  return (
    <Router>
      <MainLayout
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      >
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;