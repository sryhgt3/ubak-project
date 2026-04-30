import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Search, Bell, LogOut, ChevronRight, ShieldCheck, Crown, User, Sun, Moon, PlusCircle, LayoutDashboard, ArrowUpCircle, ArrowDownCircle, UserPlus, X
} from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdkOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsCmdkOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCmdkOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isCmdkOpen]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'DASHBOARD';
    if (path === '/add-transaction') return 'ADD TRANSACTION';
    if (path === '/add-account') return 'ADD USER';
    if (path === '/inflow') return 'INFLOW';
    if (path === '/outflow') return 'OUTFLOW';
    if (path === '/profile') return 'PROFILE';
    return 'OVERVIEW';
  };

  const renderRoleBadge = () => {
    switch (user?.role) {
      case 'Admin': return <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12}/> Admin</span>;
      case 'VIP': return <span className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Crown size={12}/> VIP</span>;
      default: return <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1">Standard</span>;
    }
  };

  const commands = [
    { name: 'Go to Dashboard', icon: <LayoutDashboard size={14}/>, path: '/dashboard' },
    { name: 'Add Transaction', icon: <PlusCircle size={14}/>, path: '/add-transaction' },
    { name: 'View Income', icon: <ArrowUpCircle size={14}/>, path: '/inflow' },
    { name: 'View Expenses', icon: <ArrowDownCircle size={14}/>, path: '/outflow' },
    ...(user?.role === 'Admin' ? [{ name: 'Add User', icon: <UserPlus size={14}/>, path: '/add-account' }] : []),
    { name: 'Profile Settings', icon: <User size={14}/>, path: '/profile' },
  ];

  const filteredCommands = commands.filter(cmd => cmd.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const executeCommand = (path: string) => {
    navigate(path);
    setIsCmdkOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <nav className="bg-white/80 dark:bg-[#030303]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 p-4 md:p-5 sticky top-0 z-30 transition-all duration-300 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={toggleSidebar} className="p-2 md:p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <Menu className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
            </button>
            <div className="flex items-center gap-2 md:gap-3 text-slate-400 dark:text-slate-500">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">System</span>
              <ChevronRight className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] hidden sm:block opacity-30" />
              <h1 className="text-[10px] md:text-sm font-black text-slate-900 dark:text-white tracking-[0.1em] uppercase truncate">{getPageTitle()}</h1>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-1 max-w-lg mx-12 relative">
            <button 
              onClick={() => setIsCmdkOpen(true)}
              className="w-full flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 rounded-2xl py-2.5 px-4 transition-all group"
            >
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                <Search size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Search or jump to...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-black text-slate-500 dark:text-slate-400">⌘</kbd>
                <kbd className="bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-black text-slate-500 dark:text-slate-400">K</kbd>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            
            <button className="p-2 md:p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 relative">
              <Bell className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
              <span className="absolute top-2 right-2 w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-[#030303]" />
            </button>
            <div className="h-6 md:h-8 w-px bg-slate-200 dark:bg-white/5 mx-1 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-end leading-none hidden md:flex">
                <span className="text-xs font-black text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider">{user?.username}</span>
                {renderRoleBadge()}
              </div>
              <div className="relative" ref={profileRef}>
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-black cursor-pointer border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-3 w-48 md:w-56 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden backdrop-blur-3xl">
                      <div className="p-4 md:p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                        <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Logged in as</p>
                        <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-widest">{user?.username}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all rounded-xl">
                          <User size={14} /> Profile Settings
                        </Link>
                        <button onClick={() => { setIsProfileOpen(false); logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all rounded-xl">
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCmdkOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCmdkOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-[#030303]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl relative z-[101] overflow-hidden"
            >
              <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                <Search size={18} className="text-slate-400 dark:text-slate-500" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 uppercase tracking-widest"
                />
                <button onClick={() => setIsCmdkOpen(false)} className="bg-slate-200 dark:bg-white/10 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, i) => (
                    <button 
                      key={i}
                      onClick={() => executeCommand(cmd.path)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                    >
                      <div className="bg-slate-200 dark:bg-white/10 p-2 rounded-lg text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {cmd.icon}
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {cmd.name}
                      </span>
                      <ChevronRight size={14} className="ml-auto text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No results found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;