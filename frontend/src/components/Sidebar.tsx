import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  UserPlus, 
  Zap,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} />, 
      roles: ['VIP', 'Free'] 
    },
    { 
      name: 'Income', 
      path: '/inflow', 
      icon: <ArrowUpCircle size={20} />, 
      roles: ['VIP', 'Free'] 
    },
    { 
      name: 'Expenses', 
      path: '/outflow', 
      icon: <ArrowDownCircle size={20} />, 
      roles: ['VIP', 'Free'] 
    },
    { 
      name: 'Add transaction', 
      path: '/add-transaction', 
      icon: <PlusCircle size={20} />, 
      roles: ['VIP', 'Free'] 
    },
    { 
      name: 'Add User', 
      path: '/add-account', 
      icon: <UserPlus size={20} />, 
      roles: ['Admin'] 
    },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div 
      className={`bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/5 flex flex-col h-screen z-40 overflow-x-hidden fixed md:sticky top-0 transition-[width,transform,background-color] duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
        isOpen 
          ? 'w-64 translate-x-0' 
          : 'w-0 -translate-x-full md:translate-x-0 md:w-20'
      }`}
    >
      {/* Header Section */}
      <div className="flex items-center h-[73px] border-b border-slate-100 dark:border-white/5 px-5 shrink-0 overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-cyan-400 to-violet-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Zap size={22} fill="currentColor" />
        </div>
        <div className={`ml-3 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white whitespace-nowrap">
            UBAK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">PRO</span>
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#0a0a0a]">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center h-12 px-3 rounded-xl text-sm font-bold transition-all duration-200 relative group ${
                isActive
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-cyan-400 border border-transparent dark:border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              } ${!isOpen && 'md:justify-center'}`
            }
          >
            <div className="shrink-0 transition-colors duration-200">
              {item.icon}
            </div>
            
            <div className={`ml-3 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 pointer-events-none'}`}>
              <span className="whitespace-nowrap uppercase tracking-widest text-[10px]">{item.name}</span>
            </div>
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block shadow-2xl border border-white/10">
                {item.name}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0a0a0a] rotate-45 border-l border-b border-white/10" />
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Sidebar Footer Indicator */}
      {isOpen && (
        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                 <Activity size={12} />
                 <span className="text-[10px] font-black uppercase tracking-tighter">System Health</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                 <div className="bg-cyan-400 w-full h-full"></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
