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
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              System Console<span className="text-rose-500">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage user access and platform security.</p>
          </div>
          <button 
            onClick={() => navigate('/add-account')}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* User Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 p-2.5 rounded-lg w-fit mb-4">
                 <Crown size={20} />
              </div>
              <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">VIP Users</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{dashboardData?.vip_users?.length || 0}</h3>
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 p-2.5 rounded-lg w-fit mb-4">
                 <UserCircle size={20} />
              </div>
              <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Free Users</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{dashboardData?.free_users?.length || 0}</h3>
           </div>
           <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-2xl text-white shadow-md border border-slate-800 dark:border-slate-700">
              <div className="bg-white/10 text-white p-2.5 rounded-lg w-fit mb-4">
                 <ShieldCheck size={20} />
              </div>
              <p className="opacity-60 text-[10px] font-semibold uppercase tracking-wider mb-1">System Status</p>
              <h3 className="text-lg font-semibold">All Systems Online</h3>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VIP Users List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="text-purple-500" size={18} /> VIP Members
            </h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
               <div className="p-2 space-y-1">
                  {dashboardData?.vip_users?.length > 0 ? dashboardData.vip_users.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 text-sm font-semibold">
                             {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{u.username}</h4>
                             <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email || 'No email'}</p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )) : <p className="text-slate-400 text-center py-10 text-sm italic">No VIP users found.</p>}
               </div>
            </div>
          </div>

          {/* Free Users List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCircle className="text-emerald-500" size={18} /> Free Members
            </h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
               <div className="p-2 space-y-1">
                  {dashboardData?.free_users?.length > 0 ? dashboardData.free_users.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 text-sm font-semibold">
                             {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{u.username}</h4>
                             <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Mail size={10}/> {u.email || 'No email'}</p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )) : <p className="text-slate-400 text-center py-10 text-sm italic">No Free users found.</p>}
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-4 text-sm font-medium shadow-sm">
          <ShieldCheck size={20} />
          {error}
        </div>
      )}

      {/* Elegant Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hi, {user?.username}<span className="text-rose-500">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Here's what's happening with your money today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/add-transaction')}
            className="bg-rose-500 text-white px-7 py-3 rounded-full text-xs font-bold shadow-lg shadow-rose-500/25 hover:bg-rose-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      {/* Main Stat Card - The Premium Look */}
      <div className="bg-slate-900 dark:bg-black p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-800">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-1">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Total Balance</p>
            <h2 className="text-5xl font-bold text-white tracking-tighter">
              {formatCurrency(dashboardData?.total_balance || 0)}
            </h2>
            <div className="flex items-center gap-3 pt-6">
               <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                  <ArrowUpCircle size={14} /> {formatCurrency(dashboardData?.total_income || 0)}
               </div>
               <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[10px] bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                  <ArrowDownCircle size={14} /> {formatCurrency(dashboardData?.total_expenses || 0)}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                <Target size={18} className="text-purple-400 mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Savings Goal</p>
                <p className="text-sm font-bold text-white truncate">{user?.savings_goal || "Not set"}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                <TrendingUp size={18} className="text-blue-400 mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Max Spend</p>
                <p className="text-sm font-bold text-white">{formatCurrency(user?.max_spending || 0)}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Chart Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Performance</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {['comparison', 'income', 'expense'].map((view) => (
                <button 
                  key={view}
                  onClick={() => setChartView(view as any)}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all capitalize ${
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

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl h-80 flex flex-col shadow-sm">
            <div className="flex-1 flex items-end justify-around gap-8 px-4 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-[0.05]">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-slate-900 dark:border-slate-100" />)}
              </div>

              {chartView === 'comparison' ? (() => {
                  const inc = dashboardData?.total_income || 0;
                  const exp = dashboardData?.total_expenses || 0;
                  const maxComp = Math.max(inc, exp, 1);
                  return (
                    <>
                      <div className="flex flex-col items-center gap-3 flex-1 max-w-[100px] group/bar h-full justify-end">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                          <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg font-medium">
                            {formatCurrency(inc)}
                          </div>
                          <div 
                            className="w-3 bg-emerald-500 rounded-full transition-all duration-700 relative overflow-hidden"
                            style={{ height: `${(inc / maxComp) * 100}%`, minHeight: '8px' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Inflow</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3 flex-1 max-w-[100px] group/bar h-full justify-end">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                          <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg font-medium">
                            {formatCurrency(exp)}
                          </div>
                          <div 
                            className="w-3 bg-rose-500 rounded-full transition-all duration-700 relative overflow-hidden"
                            style={{ height: `${(exp / maxComp) * 100}%`, minHeight: '8px' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Outflow</span>
                      </div>
                    </>
                  );
              })() : (
                <div className="w-full h-full flex items-end justify-around gap-4 h-full">
                   {(() => {
                      const type = chartView === 'income' ? 'Income' : 'Expense';
                      const filtered = dashboardData?.recent_transactions?.filter((t: any) => t.type === type) || [];
                      const recentItems = [...filtered].reverse().slice(-8);
                      const max = Math.max(...recentItems.map((t: any) => t.amount), 1);
                      
                      return recentItems.length > 0 ? recentItems.map((t: any, index: number) => (
                        <div key={t.id + '-' + index} className="flex flex-col items-center gap-3 flex-1 max-w-[40px] group/bar h-full justify-end">
                          <div className="relative w-full flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg font-medium flex flex-col items-center">
                              <span>{formatCurrency(t.amount)}</span>
                              <span className="text-[8px] opacity-70">{t.category}</span>
                            </div>
                            <div 
                              className={`w-2 rounded-full transition-all duration-700 relative overflow-hidden ${chartView === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ height: `${(t.amount / max) * 100}%`, minHeight: '6px' }}
                            >
                               <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                          </div>
                          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter truncate w-full text-center">
                            {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      )) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-3 pb-10">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                             <TrendingUp size={20} />
                          </div>
                          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">No {chartView} data to visualize.</p>
                        </div>
                      );
                   })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar Area */}
        <div className="space-y-6">
           <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-[2rem] text-white shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Quick Edit</h3>
                <p className="text-slate-400 text-xs font-medium mb-5">Update your financial targets</p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full bg-white/10 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/5"
                >
                  <Edit3 size={14} /> Open Settings
                </button>
              </div>
           </div>

           <div className="bg-rose-500 p-6 rounded-[2rem] text-white shadow-lg shadow-rose-500/20 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/add-transaction')}>
              <h3 className="text-lg font-bold mb-1">New Record</h3>
              <p className="text-rose-100 text-xs font-medium mb-5">Keep your data accurate</p>
              <div className="flex items-center gap-2 text-xs font-bold">
                 Start Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>
      </div>

      {/* Horizontal Transaction Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Income Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Inflow</h3>
            <button onClick={() => navigate('/inflow')} className="text-rose-500 text-[10px] font-bold flex items-center gap-1 hover:underline tracking-widest">
              SEE ALL <ExternalLink size={10} />
            </button>
          </div>
          <div className="space-y-1">
            {incomeTransactions.length > 0 ? incomeTransactions.map((t: any) => (
              <div key={t.id} className="group flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm border border-emerald-100 dark:border-emerald-500/20">
                    {t.category.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.category}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]">{t.description || 'No description'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+{formatCurrency(t.amount)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-xs italic py-4 font-medium">No inflow recorded.</p>
            )}
          </div>
        </div>

        {/* Expense Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Outflow</h3>
            <button onClick={() => navigate('/outflow')} className="text-rose-500 text-[10px] font-bold flex items-center gap-1 hover:underline tracking-widest">
              SEE ALL <ExternalLink size={10} />
            </button>
          </div>
          <div className="space-y-1">
            {expenseTransactions.length > 0 ? expenseTransactions.map((t: any) => (
              <div key={t.id} className="group flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center font-bold text-sm border border-rose-100 dark:border-rose-500/20">
                    {t.category.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.category}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]">{t.description || 'No description'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-600">-{formatCurrency(t.amount)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-xs italic py-4 font-medium">No outflow recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
