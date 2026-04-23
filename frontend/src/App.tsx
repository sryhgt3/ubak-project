import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';

// Temporary placeholder components
const AddTransaction = () => (
  <div className="p-10">
    <h1 className="text-3xl font-bold text-slate-900">Add Transaction</h1>
    <p className="text-slate-500 mt-2">Transaction management interface coming soon.</p>
  </div>
);

const AddAccount = () => (
  <div className="p-10">
    <h1 className="text-3xl font-bold text-slate-900">Add Account</h1>
    <p className="text-slate-500 mt-2">Account management interface coming soon.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes with Sidebar Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/add-account" element={<AddAccount />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
