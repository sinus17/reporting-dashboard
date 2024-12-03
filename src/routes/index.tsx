import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Reports from '../pages/Reports';
import ReportDetail from '../pages/ReportDetail';
import CustomerManagement from '../pages/CustomerManagement';
import Connections from '../pages/Connections';
import SharedReport from '../pages/SharedReport';
import { TikTokCallback } from '../components/connections/TikTokCallback';

export const AppRoutes: React.FC<{ isSharedView?: boolean }> = ({ isSharedView }) => {
  if (isSharedView) {
    return (
      <Routes>
        <Route path="/shared/:reportId" element={<SharedReport />} />
        <Route path="/tiktok/callback" element={<TikTokCallback />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/reports" replace />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/:reportId" element={<ReportDetail />} />
      <Route path="/customers" element={<CustomerManagement />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  );
};