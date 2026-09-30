import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Zap } from 'lucide-react';
import TransactionGroupedList from '../components/TransactionGroupedList';

const ExpensePage: React.FC = () => {
  const { token, logout, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const expenseOnly = response.data.filter((t: any) => t.type === 'Expense');
      setTransactions(expenseOnly);
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsFetching(false);
    }
  }, [token, navigate, logout]);

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token, fetchTransactions]);

  if (isLoading || isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white dark:bg-[#030303]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          <Zap className="absolute inset-0 m-auto text-violet-400 animate-pulse" size={24} fill="currentColor" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-24 md:pb-32 px-4 sm:px-0 text-slate-900 dark:text-white selection:bg-cyan-500/30">
      
      {/* Background Ambient Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-slate-50 dark:bg-[#030303]">
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 dark:bg-violet-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20 pt-4 md:pt-8">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 md:p-3.5 rounded-xl md:rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-lg dark:shadow-2xl shrink-0"
          >
            <ArrowLeft className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
          </button>
          <div className="space-y-1 md:space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-[8px] md:text-[10px] font-bold tracking-widest uppercase w-fit">
              Account History
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase text-slate-900 dark:text-white">
              Expense Log<span className="text-violet-400">.</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-48">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 md:py-4 px-4 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all text-[10px] md:text-xs font-black tracking-widest uppercase text-slate-900 dark:text-white shadow-lg dark:shadow-2xl backdrop-blur-md"
            />
          </div>
          <div className="relative group w-full md:w-96">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors">
              <Search className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
            </span>
            <input 
              type="text"
              placeholder="SEARCH TRANSACTIONS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-6 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all text-[10px] md:text-xs font-black tracking-widest uppercase placeholder:text-slate-500 dark:placeholder:text-slate-600 text-slate-900 dark:text-white shadow-lg dark:shadow-2xl backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      <div className="relative z-20">
        <TransactionGroupedList 
          transactions={transactions} 
          type="Expense" 
          onRefresh={fetchTransactions} 
          searchTerm={searchTerm}
          dateFilter={dateFilter}
        />
      </div>
    </div>
  );
};

export default ExpensePage;
