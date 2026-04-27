import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Plus,
  ArrowDownCircle,
  ExternalLink,
  Target,
  UserCircle,
  Crown,
  UserPlus,
  Activity,
  Zap,
  ArrowUpRight
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
    
    // Force dark mode for Momentum Aesthetic
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, [token, isLoading, navigate, logout]);

  if (isLoading || isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-[#030303]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          <Zap className="absolute inset-0 m-auto text-cyan-400 animate-pulse" size={24} fill="currentColor" />
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

  // ADMIN DASHBOARD
  if (user?.role === 'Admin') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24 px-4 sm:px-0 text-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              System Console<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">.</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">Manage user access and platform security.</p>
          </div>
          <button 
            onClick={() => navigate('/add-account')}
            className="bg-white text-black px-6 py-3 rounded-full text-sm font-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-violet-500/40 transition-colors"></div>
              <div className="bg-violet-500/20 text-violet-400 p-3 rounded-2xl w-fit mb-6 relative z-10 border border-violet-500/30">
                 <Crown size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">VIP Users</p>
              <h3 className="text-5xl font-black text-white relative z-10 tracking-tighter">{dashboardData?.vip_users?.length || 0}</h3>
           </div>
           <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/40 transition-colors"></div>
              <div className="bg-cyan-500/20 text-cyan-400 p-3 rounded-2xl w-fit mb-6 relative z-10 border border-cyan-500/30">
                 <UserCircle size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Free Users</p>
              <h3 className="text-5xl font-black text-white relative z-10 tracking-tighter">{dashboardData?.free_users?.length || 0}</h3>
           </div>
           <div className="bg-gradient-to-br from-cyan-600/20 to-violet-600/20 p-8 rounded-[2.5rem] text-white shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
              <div className="bg-white/10 text-white p-3 rounded-2xl w-fit mb-6 relative z-10 border border-white/20">
                 <ShieldCheck size={24} />
              </div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">System Status</p>
              <h3 className="text-2xl font-black relative z-10 tracking-tight">ALL SYSTEMS ONLINE</h3>
           </div>
        </div>
      </div>
    );
  }

  const incomeTransactions = dashboardData?.recent_transactions?.filter((t: any) => t.type === 'Income').slice(0, 5) || [];
  const expenseTransactions = dashboardData?.recent_transactions?.filter((t: any) => t.type === 'Expense').slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-24 md:pb-32 px-4 sm:px-0 text-white selection:bg-cyan-500/30">
      
      {/* Background Ambient Effects for the whole dashboard */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-[#030303]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-4 text-sm font-medium shadow-sm backdrop-blur-md">
          <ShieldCheck size={20} />
          {error}
        </div>
      )}

      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20 pt-4 md:pt-8">
        <div className="space-y-2 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] md:text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)] w-fit">
            <Zap size={12} fill="currentColor" /> Live Dashboard
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">
            HI, {user?.username?.toUpperCase()}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-medium">Here is what is happening with your money today.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/add-transaction')}
            className="w-full md:w-auto bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-black shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Bento Grid Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-6 md:mt-12">
        
        {/* Main Stat Card - The Glass Bento */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-colors">
          {/* Internal Glows */}
          <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
          
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px] md:min-h-[300px]">
            <div>
               <p className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-2 md:mb-4">Total Balance</p>
               <h2 className="text-4xl sm:text-5xl md:text-[5rem] font-black text-white tracking-tighter leading-none">
                 {formatCurrency(dashboardData?.total_balance || 0)}
               </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-8 md:pt-12">
               <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] md:text-sm bg-cyan-500/10 px-4 md:px-5 py-2 md:py-3 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                  <ArrowUpRight size={14} /> INCOME {formatCurrency(dashboardData?.total_income || 0)}
               </div>
               <div className="flex items-center gap-2 text-violet-400 font-black text-[10px] md:text-sm bg-violet-500/10 px-4 md:px-5 py-2 md:py-3 rounded-full border border-violet-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                  <ArrowDownCircle size={14} /> EXPENSES {formatCurrency(dashboardData?.total_expenses || 0)}
               </div>
            </div>
          </div>
        </div>

        {/* Workload / Targets Widget */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
           <div className="bg-gradient-to-br from-cyan-900/40 to-black p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-cyan-500/30 relative overflow-hidden flex flex-col justify-center min-h-[140px] md:min-h-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full"></div>
              <Target size={24} className="text-cyan-400 mb-3 md:mb-4 relative z-10" />
              <p className="text-cyan-400/70 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Savings Goal</p>
              <p className="text-2xl md:text-3xl font-black text-white relative z-10 tracking-tight truncate">{user?.savings_goal || "NOT SET"}</p>
           </div>
           
           <div className="bg-gradient-to-br from-violet-900/40 to-black p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-violet-500/30 relative overflow-hidden flex flex-col justify-center min-h-[140px] md:min-h-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-2xl rounded-full"></div>
              <Activity size={24} className="text-violet-400 mb-3 md:mb-4 relative z-10" />
              <p className="text-violet-400/70 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Max Spending</p>
              <p className="text-2xl md:text-3xl font-black text-white relative z-10 tracking-tight">{formatCurrency(user?.max_spending || 0)}</p>
           </div>
        </div>
      </div>

      {/* Deep Analytics Section */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden mt-6 group hover:border-slate-300 dark:hover:border-white/20 transition-colors">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">ANALYTICS</h3>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 md:mt-2">Cash flow analysis</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md w-fit">
            {['comparison', 'income', 'expense'].map((view) => (
              <button 
                key={view}
                onClick={() => setChartView(view as any)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-black transition-all uppercase tracking-widest ${
                  chartView === view 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 md:h-96 flex flex-col relative z-10">
          <div className="flex-1 flex items-end justify-around gap-4 md:gap-8 px-2 md:px-4 relative">
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-white/20 border-dashed" />)}
            </div>

            {chartView === 'comparison' ? (() => {
                const inc = dashboardData?.total_income || 0;
                const exp = dashboardData?.total_expenses || 0;
                const maxComp = Math.max(inc, exp, 1);
                return (
                  <div className="w-full flex items-end justify-center gap-12 md:gap-24 h-full pb-4">
                    <div className="flex flex-col items-center gap-4 md:gap-6 flex-1 max-w-[100px] md:max-w-[140px] group/bar h-full justify-end">
                      <div className="relative w-full flex flex-col items-center justify-end h-full">
                        <div className="absolute -top-12 md:-top-14 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-black text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-xl whitespace-nowrap z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-black">
                          {formatCurrency(inc)}
                        </div>
                        <div 
                          className="w-8 md:w-12 bg-cyan-400 rounded-t-xl md:rounded-t-2xl transition-all duration-1000 relative shadow-[0_0_30px_rgba(34,211,238,0.3)] group-hover/bar:shadow-[0_0_50px_rgba(34,211,238,0.6)]"
                          style={{ height: `${(inc / maxComp) * 100}%`, minHeight: '15px' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent rounded-t-xl md:rounded-t-2xl"></div>
                        </div>
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black text-cyan-400 uppercase tracking-widest">INCOME</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 md:gap-6 flex-1 max-w-[100px] md:max-w-[140px] group/bar h-full justify-end">
                      <div className="relative w-full flex flex-col items-center justify-end h-full">
                        <div className="absolute -top-12 md:-top-14 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-black text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-xl whitespace-nowrap z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-black">
                          {formatCurrency(exp)}
                        </div>
                        <div 
                          className="w-8 md:w-12 bg-violet-500 rounded-t-xl md:rounded-t-2xl transition-all duration-1000 relative shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover/bar:shadow-[0_0_50px_rgba(139,92,246,0.6)]"
                          style={{ height: `${(exp / maxComp) * 100}%`, minHeight: '15px' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent rounded-t-xl md:rounded-t-2xl"></div>
                        </div>
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black text-violet-400 uppercase tracking-widest">EXPENSES</span>
                    </div>
                  </div>
                );
            })() : (
              <div className="w-full h-full flex items-end justify-around gap-2 md:gap-6 h-full pb-4">
                 {(() => {
                    const type = chartView === 'income' ? 'Income' : 'Expense';
                    const filtered = dashboardData?.recent_transactions?.filter((t: any) => t.type === type) || [];
                    const recentItems = [...filtered].reverse().slice(-10);
                    const max = Math.max(...recentItems.map((t: any) => t.amount), 1);
                    
                    return recentItems.length > 0 ? recentItems.map((t: any, index: number) => (
                      <div key={t.id + '-' + index} className="flex flex-col items-center gap-2 md:gap-4 flex-1 max-w-[40px] md:max-w-[60px] group/bar h-full justify-end">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                          <div className="absolute -top-12 md:-top-16 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-black text-[8px] md:text-[10px] px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl whitespace-nowrap z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-black flex flex-col items-center">
                            <span>{formatCurrency(t.amount)}</span>
                            <span className="text-[6px] md:text-[8px] text-slate-500">{t.category}</span>
                          </div>
                          <div 
                            className={`w-3 md:w-6 rounded-t-lg md:rounded-t-xl transition-all duration-1000 relative ${chartView === 'income' ? 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]'}`}
                            style={{ height: `${(t.amount / max) * 100}%`, minHeight: '10px' }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent rounded-t-lg md:rounded-t-xl"></div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 md:w-16 h-12 md:h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-500">
                           <Activity size={24} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">NO DATA AVAILABLE</p>
                      </div>
                    );
                 })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-6">
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6 mb-4 md:mb-6 relative z-10">
            <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">Income</h3>
            <button onClick={() => navigate('/inflow')} className="text-cyan-400 text-[8px] md:text-[10px] font-black flex items-center gap-2 hover:bg-cyan-500/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors tracking-widest border border-cyan-400/20">
              SEE ALL <ExternalLink size={10} />
            </button>
          </div>
          <div className="space-y-3 relative z-10">
            {incomeTransactions.length > 0 ? incomeTransactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 group/item cursor-pointer">
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="w-10 md:w-14 h-10 md:h-14 bg-cyan-500/10 text-cyan-400 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover/item:scale-110 transition-transform shrink-0">
                    {t.category.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-black text-white truncate uppercase">{t.category}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-0.5 truncate">{t.description || 'System Entry'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm md:text-lg font-black text-cyan-400">+{formatCurrency(t.amount)}</p>
                  <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 md:py-12 flex justify-center">
                 <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group hover:border-violet-500/30 transition-colors">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6 mb-4 md:mb-6 relative z-10">
            <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">Expenses</h3>
            <button onClick={() => navigate('/outflow')} className="text-violet-400 text-[8px] md:text-[10px] font-black flex items-center gap-2 hover:bg-violet-500/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors tracking-widest border border-violet-400/20">
              SEE ALL <ExternalLink size={10} />
            </button>
          </div>
          <div className="space-y-3 relative z-10">
            {expenseTransactions.length > 0 ? expenseTransactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 group/item cursor-pointer">
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="w-10 md:w-14 h-10 md:h-14 bg-violet-500/10 text-violet-400 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-xl border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover/item:scale-110 transition-transform shrink-0">
                    {t.category.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-black text-white truncate uppercase">{t.category}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-0.5 truncate">{t.description || 'System Entry'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm md:text-lg font-black text-violet-400">-{formatCurrency(t.amount)}</p>
                  <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 md:py-12 flex justify-center">
                 <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
