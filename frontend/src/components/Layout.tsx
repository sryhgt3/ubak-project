import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SetupModal from './SetupModal';
import { Sun, Moon } from 'lucide-react';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetTheme, setTargetTheme] = useState<'light' | 'dark' | null>(null);
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = (event: React.MouseEvent) => {
    if (isAnimating) return;

    const x = event.clientX;
    const y = event.clientY;
    const nextIsDark = !isDarkMode;

    // Set coordinates for CSS animation
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    setTargetTheme(nextIsDark ? 'dark' : 'light');
    setIsAnimating(true);
    
    // Toggle state exactly when overlay is large enough (around 400ms)
    setTimeout(() => {
      setIsDarkMode(nextIsDark);
    }, 400);

    setTimeout(() => {
      setIsAnimating(false);
      setTargetTheme(null);
    }, 800);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 relative transition-colors duration-500">
      {/* Animation Overlay - Using targetTheme to prevent color flip mid-animation */}
      {isAnimating && (
        <div 
          className={`theme-transition-overlay animate-reveal ${targetTheme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}
        />
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} />
      <SetupModal />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-4 md:p-8 max-w-full">
            <Outlet />
          </div>

          {/* Dark Mode Toggle - Bottom Right */}
          <button
            ref={buttonRef}
            onClick={toggleDarkMode}
            className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[10000] group"
          >
            {isDarkMode ? (
              <Sun size={24} className="group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={24} className="group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </main>
      </div>
    </div>
  );
};

export default Layout;
