import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  UserPlus, 
  ShieldCheck
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
      name: 'Add transaction', 
      path: '/add-transaction', 
      icon: <PlusCircle size={20} />, 
      roles: ['VIP', 'Free'] 
    },
    { 
      name: 'Add Account', 
      path: '/add-account', 
      icon: <UserPlus size={20} />, 
      roles: ['Admin'] 
    },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div 
      className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen z-40 overflow-x-hidden fixed md:sticky top-0 transition-[width,transform,background-color] duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
        isOpen 
          ? 'w-64 translate-x-0' 
          : 'w-0 -translate-x-full md:translate-x-0 md:w-20'
      }`}
    >
      {/* Header Section */}
      <div className="flex items-center h-[73px] border-b border-slate-50 dark:border-slate-800 px-5 shrink-0 overflow-hidden">
        <div className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div className={`ml-3 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            UBAK <span className="text-rose-500">PRO</span>
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center h-12 px-3 rounded-xl text-sm font-bold transition-all duration-300 relative group ${
                isActive
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              } ${!isOpen && 'md:justify-center'}`
            }
          >
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </div>
            
            <div className={`ml-3 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-4 w-0 pointer-events-none'}`}>
              <span className="whitespace-nowrap">{item.name}</span>
            </div>
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden md:block shadow-xl">
                {item.name}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
