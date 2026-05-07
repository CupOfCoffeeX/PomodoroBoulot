import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from '@/components/ui/toast';
import { initNotifications } from '@/lib/notifications';
import { LandingPage } from './pages/LandingPage';
import { AppPage } from './pages/AppPage';

export default function App() {
  useEffect(() => {
    initNotifications().catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
