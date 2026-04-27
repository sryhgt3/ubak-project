import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Crown, 
  UserCircle,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: (event: React.MouseEvent) => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/add-transaction') return 'Add Transaction';
    if (path === '/add-account') return 'Add Account';
    return 'Overview';
  };

  const renderRoleBadge = () => {
    switch (user?.role) {
      case 'Admin':
        return <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1"><ShieldCheck size={12}/> Admin</span>;
      case 'VIP':
        return <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1"><Crown size={12}/> VIP</span>;
      default:
        return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1"><UserCircle size={12}/> Free</span>;
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-30 transition-colors duration-300 shrink-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block">Pages</span>
            <ChevronRight size={12} className="hidden sm:block" />
            <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors relative"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end leading-none hidden xs:flex">
              <span className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{user?.username}</span>
              {renderRoleBadge()}
            </div>
            
            <div className="group relative">
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 font-semibold cursor-pointer border border-rose-200/50 dark:border-rose-500/20">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username}</p>
                </div>
                <Link 
                  to="/profile"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-rose-500 transition-all border-b border-slate-50 dark:border-slate-700"
                >
                  <User size={18} />
                  My Profile
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-rose-500 transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
