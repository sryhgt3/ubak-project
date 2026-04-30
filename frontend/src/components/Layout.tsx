import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SetupModal from './SetupModal';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth(); // Get user from auth context

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-950 relative overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} />
      <SetupModal />
      {user?.role !== 'Admin' && <Chatbot />} {/* Conditionally render Chatbot */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto relative">
          <div className="p-4 md:p-8 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
