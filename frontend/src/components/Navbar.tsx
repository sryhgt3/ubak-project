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
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
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
        return <span className="bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><ShieldCheck size={12}/> Admin</span>;
      case 'VIP':
        return <span className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Crown size={12}/> VIP</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><UserCircle size={12}/> Free</span>;
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-30 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="text-xs font-medium uppercase tracking-widest hidden sm:block">Pages</span>
            <ChevronRight size={14} className="hidden sm:block" />
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end leading-none hidden xs:flex">
              <span className="text-sm font-bold text-slate-900 dark:text-white mb-1">{user?.username}</span>
              {renderRoleBadge()}
            </div>
            
            <div className="group relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 p-[2px] cursor-pointer shadow-lg shadow-rose-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center text-rose-500 font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.username}</p>
                </div>
                <Link 
                  to="/profile"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all border-b border-slate-50 dark:border-slate-700"
                >
                  <User size={18} />
                  My Profile
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all"
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
