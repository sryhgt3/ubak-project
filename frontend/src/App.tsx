import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AddTransactionPage from './pages/AddTransactionPage';
import AddAccountPage from './pages/AddAccountPage';
import InflowPage from './pages/InflowPage';
import OutflowPage from './pages/OutflowPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" theme="system" />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes with Sidebar Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-transaction" element={<AddTransactionPage />} />
            <Route path="/add-account" element={<AddAccountPage />} />
            <Route path="/inflow" element={<InflowPage />} />
            <Route path="/outflow" element={<OutflowPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
