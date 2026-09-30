import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowLeft, Zap } from 'lucide-react';
import TransactionGroupedList from '../components/TransactionGroupedList';

const IncomePage: React.FC = () => {
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
      const incomeOnly = response.data.filter((t: any) => t.type === 'Income');
      setTransactions(incomeOnly);
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
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <Zap className="absolute inset-0 m-auto text-cyan-400 animate-pulse" size={24} fill="currentColor" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-24 md:pb-32 px-4 sm:px-0 text-slate-800 dark:text-white selection:bg-cyan-500/10 selection:text-cyan-700 dark:selection:text-cyan-200">
      
      {/* Background Ambient Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-slate-50 dark:bg-[#030303]">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[60%] bg-cyan-200/50 dark:bg-cyan-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20 pt-4 md:pt-8">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 md:p-3.5 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-xl dark:bg-white/5 border border-white/50 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-2xl shrink-0"
          >
            <ArrowLeft className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
          </button>
          <div className="space-y-1 md:space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[8px] md:text-[10px] font-bold tracking-widest uppercase shadow-sm dark:shadow-none w-fit">
              Account History
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase text-slate-900 dark:text-white">
              Income Log<span className="text-cyan-600">.</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-48">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl py-3.5 md:py-4 px-4 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all text-[10px] md:text-xs font-black tracking-widest uppercase text-slate-800 dark:text-white shadow-sm dark:shadow-2xl backdrop-blur-md"
            />
          </div>
          <div className="relative group w-full md:w-96">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors">
              <Search className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
            </span>
            <input 
              type="text"
              placeholder="SEARCH TRANSACTIONS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-6 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all text-[10px] md:text-xs font-black tracking-widest uppercase placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-white shadow-sm dark:shadow-2xl backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      <div className="relative z-20">
        <TransactionGroupedList 
          transactions={transactions} 
          type="Income" 
          onRefresh={fetchTransactions} 
          searchTerm={searchTerm}
          dateFilter={dateFilter}
        />
      </div>
    </div>
  );
};

export default IncomePage;
