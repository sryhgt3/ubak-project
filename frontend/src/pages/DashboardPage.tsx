import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, Tooltip, Cell 
} from 'recharts';
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
  ArrowUpRight,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  MoreVertical,
  Pencil,
  Trash2,
  X
} from 'lucide-react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200/50 dark:bg-white/10 rounded-[2rem] ${className}`} />
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label || 'Transaction'}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(entry.value)}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage: React.FC = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [chartView, setChartView] = useState<'comparison' | 'income' | 'expense'>('comparison');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  
  // Edit wallet state
  const [isEditing, setIsEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', type: '', max_spending: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const fetchDashboard = async (accountId: number | null = selectedAccountId) => {
    setIsFetching(true);
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/dashboard`;
      if (accountId) url += `?account_id=${accountId}`;
      
      const response = await axios.get(url, {
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

  useEffect(() => {
    if (!isLoading && !token) {
      navigate('/login');
      return;
    }

    if (token) fetchDashboard(selectedAccountId);
  }, [token, isLoading, navigate, logout, selectedAccountId, user?.setup_completed]);

  const handleDeleteWallet = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this wallet? All associated transactions will be lost.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selectedAccountId === id) setSelectedAccountId(null);
      fetchDashboard(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/api/accounts/${isEditing.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(null);
      fetchDashboard(selectedAccountId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/api/payment/create`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { token: snapToken } = response.data;

      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: (result: any) => {
          console.log('success', result);
          alert('Payment success! You are now a VIP.');
          window.location.reload();
        },
        onPending: (result: any) => {
          console.log('pending', result);
          alert('Waiting for your payment!');
        },
        onError: (result: any) => {
          console.log('error', result);
          alert('Payment failed!');
        },
        onClose: () => {
          console.log('customer closed the popup without finishing the payment');
        }
      });
    } catch (err) {
      console.error('Failed to initiate payment', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const healthData = useMemo(() => {
    if (!dashboardData) return null;
  
    const income = dashboardData.total_income || 0;
    const expense = dashboardData.total_expenses || 0;
    
    // Determine effective max spending: selected account or total of all wallets
    let maxSpending = 0;
    if (selectedAccountId) {
      const selectedAccount = dashboardData.accounts?.find((a: any) => a.id === selectedAccountId);
      maxSpending = selectedAccount?.max_spending || 0;
    } else {
      // Sum max_spending from all accounts
      const totalWalletsMaxSpending = dashboardData.accounts?.reduce((acc: number, curr: any) => acc + (curr.max_spending || 0), 0) || 0;
      // Fallback to global user max_spending if wallets have no limits
      maxSpending = totalWalletsMaxSpending > 0 ? totalWalletsMaxSpending : (dashboardData.max_spending || 0);
    }

    // Ratio logic: Use maxSpending if available, otherwise income
    const isUsingLimit = maxSpending > 0;
    const denominator = isUsingLimit ? maxSpending : income;
    const ratio = denominator === 0 ? 0 : (expense / denominator) * 100;

    // Edge case: tidak ada pemasukan atau limit
    if (denominator === 0) {
      return {
        lottie: "https://lottie.host/6783cb59-59ef-493c-ace9-bba15d7d8426/4ILlmFjW5Y.lottie",
        color: "text-rose-600",
        bg: "bg-rose-600/10",
        border: "border-rose-600/20",
        insight: isUsingLimit ? "Limit tidak valid (0), kondisi kritis" : "Tidak ada pemasukan, kondisi keuangan kritis",
        label: "Danger"
      };
    }

    if (ratio >= 100) {
      return {
        lottie: "https://lottie.host/6783cb59-59ef-493c-ace9-bba15d7d8426/4ILlmFjW5Y.lottie",
        color: "text-rose-600",
        bg: "bg-rose-600/10",
        border: "border-rose-600/20",
        insight: isUsingLimit ? "Pengeluaran telah melebihi limit!" : "Pengeluaran menyamai atau melebihi pemasukan!",
        label: "Danger"
      };
    } else if (ratio >= 80) {
      return {
        lottie: "https://lottie.host/6783cb59-59ef-493c-ace9-bba15d7d8426/4ILlmFjW5Y.lottie",
        color: "text-rose-400",
        bg: "bg-rose-400/10",
        border: "border-rose-400/20",
        insight: isUsingLimit ? `Pengeluaran mendekati limit (≥80%)` : "Pengeluaran sangat tinggi (≥80%)",
        label: "Warning"
      };
    } else if (ratio >= 60) {
      return {
        lottie: "https://lottie.host/75c8ab58-3c1a-4a59-93d9-4e428aca185f/2rEXL2OBGF.lottie",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        insight: isUsingLimit ? "Pengeluaran mulai mendekati batas limit" : "Mulai mendekati batas aman",
        label: "Caution"
      };
    } else if (ratio >= 40) {
      return {
        lottie: "https://lottie.host/0527b941-d001-4b2c-8af2-82b5e3f51f52/eZPpWnp7jx.lottie",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        insight: isUsingLimit ? "Pengeluaran aman terkendali" : "Pengeluaran cukup terkendali",
        label: "Sehat"
      };
    } else {
      return {
        lottie: "https://lottie.host/05bae99e-3f32-4287-a351-2b85cc3e95d6/HqGUcCGvMm.lottie",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        insight: isUsingLimit ? "Pengeluaran jauh di bawah limit" : "Keuangan sangat sehat (pengeluaran rendah)",
        label: "Sehat"
      };
    }
  }, [dashboardData, selectedAccountId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getWalletIcon = (type: string) => {
    switch(type) {
      case 'Bank': return <CreditCard size={18} />;
      case 'EWallet': return <Banknote size={18} />;
      default: return <Coins size={18} />;
    }
  };

  // ADMIN DASHBOARD
  if (user?.role === 'Admin') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24 px-4 sm:px-0 text-slate-900 dark:text-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              System Console<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Manage user access and platform security.</p>
          </div>
          <button 
            onClick={() => navigate('/add-account')}
            className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-black shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Add User
          </button>
        </div>

        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Skeleton className="h-48" />
             <Skeleton className="h-48" />
             <Skeleton className="h-48" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl dark:shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-violet-500/40 transition-colors"></div>
                <div className="bg-violet-500/20 text-violet-600 dark:text-violet-400 p-3 rounded-2xl w-fit mb-6 relative z-10 border border-violet-500/30">
                   <Crown size={24} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">VIP Users</p>
                <h3 className="text-5xl font-black text-slate-900 dark:text-white relative z-10 tracking-tighter">{dashboardData?.vip_users?.length || 0}</h3>
             </div>
             <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl dark:shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/40 transition-colors"></div>
                <div className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 p-3 rounded-2xl w-fit mb-6 relative z-10 border border-cyan-500/30">
                   <UserCircle size={24} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Free Users</p>
                <h3 className="text-5xl font-black text-slate-900 dark:text-white relative z-10 tracking-tighter">{dashboardData?.free_users?.length || 0}</h3>
             </div>
             <div className="bg-gradient-to-br from-cyan-600/20 to-violet-600/20 dark:from-cyan-600/20 dark:to-violet-600/20 p-8 rounded-[2.5rem] text-slate-900 dark:text-white shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden backdrop-blur-xl">
                <div className="bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white p-3 rounded-2xl w-fit mb-6 relative z-10 border border-slate-900/10 dark:border-white/20">
                   <ShieldCheck size={24} />
                </div>
                <p className="text-slate-600 dark:text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">System Status</p>
                <h3 className="text-2xl font-black relative z-10 tracking-tight">ALL SYSTEMS ONLINE</h3>
             </div>
          </div>
        )}
      </div>
    );
  }

  const incomeTransactions = dashboardData?.recent_transactions?.filter((t: any) => t.type === 'Income').slice(0, 5) || [];
  const expenseTransactions = dashboardData?.recent_transactions?.filter((t: any) => t.type === 'Expense').slice(0, 5) || [];

  // Prepare chart data
  const comparisonData = [
    { name: 'Income', amount: dashboardData?.total_income || 0, fill: '#22d3ee' },
    { name: 'Expenses', amount: dashboardData?.total_expenses || 0, fill: '#8b5cf6' }
  ];

  const timeSeriesData = dashboardData?.recent_transactions ? 
    [...dashboardData.recent_transactions]
      .reverse()
      .filter((t: any) => chartView === 'income' ? t.type === 'Income' : t.type === 'Expense')
      .map((t: any) => ({
        date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        amount: t.amount,
        category: t.category
      })) : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-32 px-4 sm:px-0 text-slate-800 dark:text-white selection:bg-cyan-500/30"
    >
      
      {/* Background Ambient Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-slate-50 dark:bg-[#030303]">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] bg-violet-200/50 dark:bg-violet-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[60%] bg-cyan-200/50 dark:bg-cyan-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {error && (
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl flex items-center gap-4 text-sm font-medium shadow-sm backdrop-blur-md">
          <ShieldCheck size={20} />
          {error}
        </motion.div>
      )}

      {user?.role === 'Free' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group overflow-hidden bg-gradient-to-r from-cyan-600/20 to-violet-600/20 border border-cyan-500/30 p-8 rounded-[2.5rem] md:rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-2xl shadow-2xl"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="bg-gradient-to-br from-cyan-500 to-violet-600 text-white p-4 rounded-[1.5rem] shadow-lg shadow-cyan-500/20">
              <Crown size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Upgrade to VIP Status</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md">Unlock unlimited wallets, advanced AI financial insights, and exclusive VIP features for just <span className="text-cyan-600 dark:text-cyan-400 font-black">RP 10.000</span>.</p>
            </div>
          </div>
          <button 
            onClick={handleUpgrade}
            className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-black px-12 py-4 rounded-full font-black uppercase text-sm tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Upgrade Now
          </button>
        </motion.div>
      )}

      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20 pt-4 md:pt-8">
        <div className="space-y-2 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[8px] md:text-[10px] font-bold tracking-widest uppercase shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.2)] w-fit">
            <Zap size={12} fill="currentColor" /> Live Dashboard
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white uppercase">
            {selectedAccountId ? dashboardData?.accounts?.find((a:any) => a.id === selectedAccountId)?.name : "OVERVIEW"}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-medium">
            {selectedAccountId ? `Showing data for ${dashboardData?.accounts?.find((a:any) => a.id === selectedAccountId)?.name}` : `Hi ${user?.username}, here is what is happening with your money today.`}
          </p>
        </div>
        <div className="flex gap-4">
          {selectedAccountId && (
            <button 
              onClick={() => setSelectedAccountId(null)}
              className="bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            >
              All Wallets
            </button>
          )}
          <button 
            onClick={() => navigate('/add-transaction')}
            className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-black shadow-lg dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>
      </div>

      {isFetching ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-6 md:mt-12">
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <Skeleton className="h-[300px] md:h-[400px]" />
            <Skeleton className="h-[140px] md:h-[190px]" />
          </div>
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            <Skeleton className="h-[140px] md:h-[190px]" />
            <Skeleton className="h-[140px] md:h-[190px]" />
          </div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-6 md:mt-12"
        >
          {/* Left Column: Balance and Health Emote */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            {/* Main Stat Card (Total Balance) */}
            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden group hover:border-white dark:hover:border-white/20 transition-all duration-500 rounded-[2.5rem] md:rounded-[3rem]">
              <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-cyan-400/5 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
              
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px] md:min-h-[300px] p-6 md:p-10">
                <div>
                   <p className="text-slate-400 dark:text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-2 md:mb-4">Total Balance</p>
                   <h2 className="text-4xl sm:text-5xl md:text-[5rem] font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                     {formatCurrency(dashboardData?.total_balance || 0)}
                   </h2>
                </div>
                
                <div className="flex flex-row items-center gap-2 md:gap-4 pt-8 md:pt-12 overflow-x-auto scrollbar-hide pb-2">
                   <div className="flex items-center gap-1.5 md:gap-2 text-cyan-600 dark:text-cyan-400 font-black text-[8px] sm:text-[10px] md:text-sm bg-cyan-500/5 dark:bg-cyan-500/10 px-3 md:px-5 py-2 md:py-3 rounded-full border border-cyan-500/10 dark:border-cyan-500/20 backdrop-blur-md shadow-sm dark:shadow-[0_0_20px_rgba(34,211,238,0.15)] whitespace-nowrap shrink-0">
                      <ArrowUpRight size={14} className="shrink-0" /> <span className="hidden xs:inline">INCOME </span>{formatCurrency(dashboardData?.total_income || 0)}
                   </div>
                   <div className="flex items-center gap-1.5 md:gap-2 text-violet-600 dark:text-violet-400 font-black text-[8px] sm:text-[10px] md:text-sm bg-violet-500/5 dark:bg-violet-500/10 px-3 md:px-5 py-2 md:py-3 rounded-full border border-violet-500/10 dark:border-violet-500/20 backdrop-blur-md shadow-sm dark:shadow-[0_0_20px_rgba(139,92,246,0.15)] whitespace-nowrap shrink-0">
                      <ArrowDownCircle size={14} className="shrink-0" /> <span className="hidden xs:inline">EXPENSES </span>{formatCurrency(dashboardData?.total_expenses || 0)}
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Health Emote Card (Moved under Total Balance) */}
            {healthData && (
              <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/50 dark:border-white/10 relative overflow-hidden flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all duration-500 group">
                  <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 relative z-10">
                      <DotLottieReact src={healthData.lottie} loop autoplay />
                  </div>
                  <div className="relative z-10">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${healthData.bg} ${healthData.color} ${healthData.border} border text-[10px] font-black uppercase tracking-widest mb-2`}>
                          <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                          KONDISI {healthData.label}
                      </div>
                      <p className="text-sm md:text-lg font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">
                          "{healthData.insight}"
                      </p>
                  </div>
                  <div className={`absolute -right-4 -bottom-4 w-32 h-32 ${healthData.bg} blur-3xl rounded-full opacity-50`}></div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Targets and Spending */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
             <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/50 dark:border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[140px] md:min-h-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all duration-500 hover:border-cyan-500/30 group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 dark:bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-colors pointer-events-none"></div>
                <div className="bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 p-2.5 rounded-xl w-fit mb-4 relative z-10 border border-cyan-500/20">
                   <Target size={20} />
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Savings Goal</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white relative z-10 tracking-tight truncate uppercase">{user?.savings_goal || "NOT SET"}</p>
             </motion.div>
             
             <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/50 dark:border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[140px] md:min-h-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all duration-500 hover:border-violet-500/30 group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/10 dark:bg-violet-500/20 blur-2xl rounded-full group-hover:bg-violet-500/30 transition-colors pointer-events-none"></div>
                <div className="bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 p-2.5 rounded-xl w-fit mb-4 relative z-10 border border-violet-500/20">
                   <Activity size={20} />
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Max Spending</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white relative z-10 tracking-tight">
                  {formatCurrency(
                    selectedAccountId 
                      ? (dashboardData?.accounts?.find((a: any) => a.id === selectedAccountId)?.max_spending || 0)
                      : (dashboardData?.accounts?.reduce((acc: number, curr: any) => acc + (curr.max_spending || 0), 0) || user?.max_spending || 0)
                  )}
                </p>
             </motion.div>
          </div>
        </motion.div>
      )}
      

      {/* Wallets Section */}
      {!isFetching && dashboardData?.accounts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Your Wallets</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 hover:underline transition-all">MANAGE WALLETS</button>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:overflow-x-auto pb-6 scrollbar-hide px-1">
            {/* All Wallets Card */}
            <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setSelectedAccountId(null)}
                className={`w-full md:w-[280px] p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group shrink-0 ${
                    selectedAccountId === null 
                    ? 'bg-gradient-to-br from-cyan-600 to-violet-600 text-white border-transparent shadow-xl dark:shadow-[0_20px_40px_rgba(34,211,238,0.2)]' 
                    : 'bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border-white/50 dark:border-white/10 text-slate-900 dark:text-white hover:border-cyan-500/50'
                }`}
            >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${selectedAccountId === null ? 'bg-white/20' : 'bg-slate-50 dark:bg-white/5 shadow-inner'}`}>
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h4 className="font-black text-sm md:text-xs uppercase tracking-tight">All Wallets</h4>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedAccountId === null ? 'text-white/60' : 'text-slate-400'}`}>Total Summary</span>
                    </div>
                  </div>
                  
                  <div className="text-right md:hidden">
                    <p className={`text-base font-black tracking-tighter ${selectedAccountId === null ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
                        {formatCurrency(dashboardData?.accounts?.reduce((acc: number, curr: any) => acc + curr.balance, 0) || 0)}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block mt-6 relative z-10">
                    <p className={`text-2xl font-black tracking-tighter ${selectedAccountId === null ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
                        {formatCurrency(dashboardData?.accounts?.reduce((acc: number, curr: any) => acc + curr.balance, 0) || 0)}
                    </p>
                </div>
            </motion.div>

            {dashboardData.accounts.map((acc: any) => (
              <motion.div
                key={acc.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`w-full md:w-[280px] p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer relative group shrink-0 ${
                    selectedAccountId === acc.id 
                    ? 'bg-gradient-to-br from-cyan-600/80 to-violet-600/80 text-white border-transparent shadow-xl dark:shadow-[0_20px_40px_rgba(34,211,238,0.15)]' 
                    : 'bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border-white/50 dark:border-white/10 text-slate-900 dark:text-white hover:border-cyan-500/50'
                }`}
              >
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 blur-2xl rounded-full transition-colors ${selectedAccountId === acc.id ? 'bg-white/20' : 'bg-cyan-500/5 group-hover:bg-cyan-500/10'}`}></div>
                </div>

                <div className="flex items-center justify-between mb-4 relative z-20">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${selectedAccountId === acc.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-white/5 shadow-inner'}`}>
                        {getWalletIcon(acc.type)}
                    </div>
                    <div>
                        <h4 className="font-black text-sm md:text-xs uppercase tracking-tight">{acc.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedAccountId === acc.id ? 'text-white/60' : 'text-slate-400'}`}>{acc.type}</p>
                          {acc.max_spending > 0 && (
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${selectedAccountId === acc.id ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
                                <Activity size={8} /> {formatCurrency(acc.max_spending)}
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right md:hidden">
                        <p className={`text-base font-black tracking-tighter ${selectedAccountId === acc.id ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
                        {formatCurrency(acc.balance)}
                        </p>
                    </div>
                    <div className="relative z-30">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === acc.id ? null : acc.id);
                            }}
                            className={`p-2 rounded-xl transition-colors ${selectedAccountId === acc.id ? 'hover:bg-white/20 text-white/70' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400'}`}
                        >
                            <MoreVertical size={16} />
                        </button>
                        
                        <AnimatePresence>
                            {activeMenuId === acc.id && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-[90]" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(null);
                                        }}
                                    />
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 py-2 z-[100] backdrop-blur-xl"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button 
                                            onClick={() => {
                                                setIsEditing(acc);
                                                setEditForm({ name: acc.name, type: acc.type, max_spending: acc.max_spending || '' });
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-3 transition-colors"
                                        >                                            <Pencil size={12} /> Edit Wallet
                                        </button>
                                        <button 
                                            onClick={() => {
                                                handleDeleteWallet(acc.id);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                                        >
                                            <Trash2 size={12} /> Delete Wallet
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block mt-6 relative z-10">
                  <p className={`text-2xl font-black tracking-tighter ${selectedAccountId === acc.id ? 'text-white' : 'text-cyan-600 dark:text-cyan-400'}`}>
                    {formatCurrency(acc.balance)}
                  </p>
                </div>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/add-wallet')}
              className="w-full md:w-[240px] p-5 md:p-6 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex md:flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all group shrink-0"
            >
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Add New Wallet</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Deep Analytics Section ... rest of code unchanged ... */}
      {!isFetching && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden mt-6 group hover:border-white dark:hover:border-white/20 transition-all duration-500"
        >
          {/* ... existing analytics content ... */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-500/5 dark:bg-violet-500/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-800 dark:text-white">ANALYTICS</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 md:mt-2">Cash flow analysis</p>
            </div>
            <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/10 backdrop-blur-md w-fit relative z-20">
              {['comparison', 'income', 'expense'].map((view) => (
                <button 
                  key={view}
                  onClick={() => setChartView(view as any)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-black transition-all uppercase tracking-widest ${
                    chartView === view 
                      ? 'bg-white text-slate-800 dark:bg-white dark:text-black shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[240px] md:h-[320px] lg:h-[380px] relative z-10">
            {chartView === 'comparison' ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[16, 16, 0, 0]} maxBarSize={120}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              timeSeriesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartView === 'income' ? '#22d3ee' : '#8b5cf6'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartView === 'income' ? '#22d3ee' : '#8b5cf6'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke={chartView === 'income' ? '#22d3ee' : '#8b5cf6'} strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-500">
                     <Activity size={24} />
                  </div>
                  <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">NO DATA AVAILABLE</p>
                </div>
              )
            )}
          </div>
        </motion.div>
      )}

      {/* Ledger Feed ... rest of code unchanged ... */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-6">
        {['Income', 'Expense'].map((type, idx) => {
          const txs = type === 'Income' ? incomeTransactions : expenseTransactions;
          const isIncome = type === 'Income';
          const colorClass = isIncome ? 'text-cyan-600 dark:text-cyan-400' : 'text-violet-600 dark:text-violet-400';
          const bgClass = isIncome ? 'bg-cyan-500/5 dark:bg-cyan-500/10' : 'bg-violet-500/5 dark:bg-violet-500/10';
          const borderClass = isIncome ? 'border-cyan-400/10' : 'border-violet-400/10';
          const path = isIncome ? '/inflow' : '/outflow';

          return (
            <motion.div 
              key={type}
              initial={{ opacity: 0, x: isIncome ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
              className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden group hover:border-white transition-all duration-500"
            >
              <div className="flex items-center justify-between border-b border-slate-100/50 dark:border-white/5 pb-4 md:pb-6 mb-4 md:mb-6 relative z-10">
                <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase text-slate-800 dark:text-white">{type}</h3>
                <button onClick={() => navigate(path)} className={`${colorClass} text-[8px] md:text-[10px] font-black flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-colors tracking-widest border ${borderClass}`}>
                  SEE ALL <ExternalLink size={10} />
                </button>
              </div>
              
              <div className="space-y-3 relative z-10">
                {isFetching ? (
                  [1,2,3].map(i => <Skeleton key={i} className="h-[72px]" />)
                ) : txs.length > 0 ? (
                  <AnimatePresence>
                    {txs.map((t: any, i: number) => (
                      <motion.div 
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 md:p-5 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white dark:hover:border-white/10 cursor-pointer shadow-sm hover:shadow-md dark:shadow-none group/item"
                      >
                        <div className="flex items-center gap-3 md:gap-5">
                          <div className={`w-10 md:w-14 h-10 md:h-14 ${bgClass} ${colorClass} rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-xl border border-transparent shadow-sm group-hover/item:scale-110 transition-transform shrink-0`}>
                            {t.category.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm md:text-base font-black text-slate-800 dark:text-white truncate uppercase">{t.category}</h4>
                            <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5 truncate">{t.description || 'System Entry'}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm md:text-lg font-black ${colorClass}`}>
                            {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                          </p>
                          <p className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-10 md:py-12 flex flex-col items-center justify-center space-y-4"
                  >
                     <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-500 border border-slate-200/50 dark:border-white/10">
                        <Wallet size={24} />
                     </div>
                     <div className="text-center">
                       <p className="text-slate-500 dark:text-slate-400 text-xs font-black tracking-widest uppercase">No {type} Yet</p>
                       <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 font-medium">Your entries will appear here.</p>
                     </div>
                     <button onClick={() => navigate('/add-transaction')} className={`mt-2 ${colorClass} text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-current px-4 py-2 rounded-full transition-all`}>
                        Add First Entry
                     </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Edit Wallet Modal */}
      <AnimatePresence>
        {isEditing && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/40 dark:bg-black/60">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">Edit Wallet</h2>
                            <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateWallet} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Wallet Name</label>
                                <input 
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Wallet Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Bank', 'EWallet', 'Cash'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setEditForm({...editForm, type: type})}
                                            className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${
                                                editForm.type === type 
                                                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' 
                                                : 'border-slate-100 dark:border-white/5 text-slate-400'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Max Spending (Optional)</label>
                                <input 
                                    type="text"
                                    value={editForm.max_spending}
                                    onChange={(e) => setEditForm({...editForm, max_spending: e.target.value.replace(/[^0-9]/g, '')})}
                                    placeholder="No limit"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold"
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isUpdating ? <Activity className="animate-spin" size={18} /> : "Update Wallet"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardPage;
