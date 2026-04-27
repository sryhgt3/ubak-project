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
    if (path === '/dashboard') return 'DASHBOARD';
    if (path === '/add-transaction') return 'ADD TRANSACTION';
    if (path === '/add-account') return 'ADD USER';
    return 'OVERVIEW';
  };

  const renderRoleBadge = () => {
    switch (user?.role) {
      case 'Admin':
        return <span className="bg-white/5 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.2)]"><ShieldCheck size={12}/> Admin</span>;
      case 'VIP':
        return <span className="bg-white/5 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(139,92,246,0.2)]"><Crown size={12}/> VIP</span>;
      default:
        return <span className="bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1">Standard</span>;
    }
  };

  return (
    <nav className="bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5 p-4 md:p-5 sticky top-0 z-30 transition-all duration-300 shrink-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-5">
          <button 
            onClick={toggleSidebar}
            className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-slate-400 hover:text-white"
          >
            <Menu className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
          </button>
          
          <div className="flex items-center gap-2 md:gap-3 text-slate-500 overflow-hidden">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block shrink-0">System</span>
            <ChevronRight className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] hidden sm:block opacity-30 shrink-0" />
            <h1 className="text-[10px] md:text-sm font-black text-white tracking-[0.1em] uppercase truncate max-w-[120px] md:max-w-none">{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-600 uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-slate-400 hover:text-cyan-400"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /> : <Moon className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />}
          </button>

          <button className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-slate-400 hover:text-cyan-400 relative">
            <Bell className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
            <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-400 rounded-full border-2 border-[#030303] shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </button>
          
          <div className="h-6 md:h-8 w-px bg-white/5 mx-1 md:mx-2" />
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-end leading-none hidden md:flex">
              <span className="text-xs font-black text-white mb-1.5 uppercase tracking-wider">{user?.username}</span>
              {renderRoleBadge()}
            </div>
            
            <div className="group relative">
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center text-cyan-400 font-black cursor-pointer border border-white/10 hover:border-cyan-500/50 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              
              <div className="absolute right-0 mt-3 w-48 md:w-56 bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden backdrop-blur-3xl">
                <div className="p-4 md:p-5 border-b border-white/5 bg-white/5">
                  <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 md:mb-2">Logged in as</p>
                  <p className="text-xs md:text-sm font-black text-white truncate uppercase tracking-widest">{user?.username}</p>
                </div>
                <div className="p-2">
                  <Link 
                    to="/profile"
                    className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-cyan-400 transition-all rounded-xl"
                  >
                    <User className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
                    Profile Settings
                  </Link>
                  <button 
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all rounded-xl"
                  >
                    <LogOut className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
