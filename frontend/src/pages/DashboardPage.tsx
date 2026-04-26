import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Loader2, 
  TrendingUp,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Edit3,
  ExternalLink,
  Target,
  ChevronRight,
  UserCircle,
  Crown,
  Mail,
  UserPlus
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [chartView, setChartView] = useState<'comparison' | 'income' | 'expense'>('comparison');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !token) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
      } catch (err: any) {
        setError('Failed to fetch dashboard data. Your session may have expired.');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (token) fetchDashboard();
  }, [token, isLoading, navigate, logout]);

  if (isLoading || isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
          <Loader2 className="absolute inset-0 m-auto text-rose-500 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (user?.role === 'Admin') {
    return (
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              System Console <span className="text-rose-500">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage user access and platform security.</p>
          </div>
          <button 
            onClick={() => navigate('/add-account')}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Create New Account
          </button>
        </div>

        {/* User Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 p-3 rounded-xl w-fit mb-4">
                 <Crown size={24} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">VIP Users</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{dashboardData?.vip_users?.length || 0}</h3>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 p-3 rounded-xl w-fit mb-4">
                 <UserCircle size={24} />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Free Users</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{dashboardData?.free_users?.length || 0}</h3>
           </div>
           <div className="bg-slate-900 dark:bg-white p-8 rounded-[2.5rem] text-white dark:text-slate-900 shadow-xl">
              <div className="bg-white/10 dark:bg-slate-100 text-white dark:text-slate-900 p-3 rounded-xl w-fit mb-4">
                 <ShieldCheck size={24} />
              </div>
              <p className="opacity-60 text-xs font-bold uppercase tracking-widest mb-1">System Status</p>
              <h3 className="text-xl font-black">All Systems Online</h3>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* VIP Users List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="text-purple-500" size={20} /> VIP Members
            </h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
               <div className="p-4 space-y-2">
                  {dashboardData?.vip_users?.length > 0 ? dashboardData.vip_users.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
                             {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-slate-900 dark:text-white">{u.username}</h4>
                             <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email || 'No email'}</p>
                          </div>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )) : <p className="text-slate-400 text-center py-10 italic">No VIP users found.</p>}
               </div>
            </div>
          </div>

          {/* Free Users List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCircle className="text-emerald-500" size={20} /> Free Members
            </h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
               <div className="p-4 space-y-2">
                  {dashboardData?.free_users?.length > 0 ? dashboardData.free_users.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 font-bold">
                             {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-slate-900 dark:text-white">{u.username}</h4>
                             <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email || 'No email'}</p>
                          </div>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )) : <p className="text-slate-400 text-center py-10 italic">No Free users found.</p>}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER DASHBOARD (VIP/Free)
  const incomeTransactions = dashboardData?.recent_transactions?.filter((t: any) => t.type === 'Income').slice(0, 5) || [];
  const expenseTransactions = dashboardData?.recent_transactions?.filter((t: any) => t.type === 'Expense').slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-6 rounded-3xl flex items-center gap-4 font-medium shadow-sm">
          <ShieldCheck size={24} />
          {error}
        </div>
      )}

      {/* Elegant Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hi, {user?.username} <span className="text-rose-500">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Here's what's happening with your money today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/add-transaction')}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      {/* Main Stat Card - The Elegant Look */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 rounded-[3rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
          <Wallet size={300} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-2">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Total Balance</p>
            <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
              {formatCurrency(dashboardData?.total_balance || 0)}
            </h2>
            <div className="flex items-center gap-4 pt-4">
               <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                  <ArrowUpCircle size={14} /> {formatCurrency(dashboardData?.total_income || 0)}
               </div>
               <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full">
                  <ArrowDownCircle size={14} /> {formatCurrency(dashboardData?.total_expenses || 0)}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                <Target size={20} className="text-purple-500 mb-3" />
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Savings Goal</p>
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.savings_goal || "Not set"}</p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                <TrendingUp size={20} className="text-blue-500 mb-3" />
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Max Spend</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(user?.max_spending || 0)}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Comparison Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Performance</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {['comparison', 'income', 'expense'].map((view) => (
                <button 
                  key={view}
                  onClick={() => setChartView(view as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                    chartView === view 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] h-80 flex flex-col">
            <div className="flex-1 flex items-end justify-around gap-8 px-4 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-slate-200 dark:border-slate-700" />)}
              </div>

              {chartView === 'comparison' ? (() => {
                  const inc = dashboardData?.total_income || 0;
                  const exp = dashboardData?.total_expenses || 0;
                  const maxComp = Math.max(inc, exp, 1);
                  return (
                    <>
                      <div className="flex flex-col items-center gap-4 flex-1 max-w-[120px] group/bar h-full justify-end">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                          <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl font-bold">
                            {formatCurrency(inc)}
                          </div>
                          <div 
                            className="w-full bg-emerald-500 rounded-t-2xl transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.2)] dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden"
                            style={{ height: `${(inc / maxComp) * 100}%`, minHeight: '8px' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Inflow</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-4 flex-1 max-w-[120px] group/bar h-full justify-end">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                          <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl font-bold">
                            {formatCurrency(exp)}
                          </div>
                          <div 
                            className="w-full bg-rose-500 rounded-t-2xl transition-all duration-1000 shadow-[0_0_15px_rgba(244,63,94,0.2)] dark:shadow-[0_0_15px_rgba(244,63,94,0.1)] relative overflow-hidden"
                            style={{ height: `${(exp / maxComp) * 100}%`, minHeight: '8px' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Outflow</span>
                      </div>
                    </>
                  );
              })() : (
                <div className="w-full h-full flex items-end justify-around gap-4 h-full">
                   {(() => {
                      const type = chartView === 'income' ? 'Income' : 'Expense';
                      const filtered = dashboardData?.recent_transactions?.filter((t: any) => t.type === type) || [];
                      const recentItems = [...filtered].reverse().slice(-6);
                      const max = Math.max(...recentItems.map((t: any) => t.amount), 1);
                      
                      return recentItems.length > 0 ? recentItems.map((t: any, index: number) => (
                        <div key={t.id + '-' + index} className="flex flex-col items-center gap-3 flex-1 max-w-[60px] group/bar h-full justify-end">
                          <div className="relative w-full flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl font-bold flex flex-col items-center">
                              <span>{formatCurrency(t.amount)}</span>
                              <span className="text-[8px] text-slate-300 font-medium">{t.category}</span>
                            </div>
                            <div 
                              className={`w-full rounded-t-xl transition-all duration-700 relative overflow-hidden ${chartView === 'income' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.3)]'}`}
                              style={{ height: `${(t.amount / max) * 100}%`, minHeight: '8px' }}
                            >
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter truncate w-full text-center">
                            {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      )) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-3 pb-10">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                             <TrendingUp size={24} />
                          </div>
                          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No {chartView} data to visualize.</p>
                        </div>
                      );
                   })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar Area */}
        <div className="space-y-8">
           <div className="bg-slate-900 dark:bg-white p-8 rounded-[2.5rem] text-white dark:text-slate-900 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Quick Edit</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-6">Update your financial targets</p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full bg-white/10 dark:bg-slate-100 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/20 dark:hover:bg-slate-200 transition-all"
                >
                  <Edit3 size={16} /> Open Settings
                </button>
              </div>
           </div>

           <div className="bg-rose-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-200 dark:shadow-none relative overflow-hidden group cursor-pointer" onClick={() => navigate('/add-transaction')}>
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform duration-500">
                <Plus size={80} />
              </div>
              <h3 className="text-xl font-bold mb-1">New Record</h3>
              <p className="text-rose-100 text-xs font-medium mb-6">Keep your data accurate</p>
              <div className="flex items-center gap-2 text-sm font-black">
                 Start Now <ChevronRight size={16} />
              </div>
           </div>
        </div>
      </div>

      {/* Horizontal Transaction Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Income Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Inflow</h3>
            <button onClick={() => navigate('/inflow')} className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:underline">
              SEE ALL <ExternalLink size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {incomeTransactions.length > 0 ? incomeTransactions.map((t: any) => (
              <div key={t.id} className="group flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    {t.category.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.category}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]">{t.description || 'No description'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">+{formatCurrency(t.amount)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic py-4">No inflow recorded.</p>
            )}
          </div>
        </div>

        {/* Expense Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Outflow</h3>
            <button onClick={() => navigate('/outflow')} className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:underline">
              SEE ALL <ExternalLink size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {expenseTransactions.length > 0 ? expenseTransactions.map((t: any) => (
              <div key={t.id} className="group flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center font-bold">
                    {t.category.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.category}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]">{t.description || 'No description'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-rose-600">-{formatCurrency(t.amount)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic py-4">No outflow recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
