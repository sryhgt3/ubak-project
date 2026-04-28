import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowDownCircle,
  TrendingUp,
  Search,
  ArrowLeft,
  Zap
} from 'lucide-react';

const OutflowPage: React.FC = () => {
  const { token, logout, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const outflowOnly = response.data.filter((t: any) => t.type === 'Expense');
        setTransactions(outflowOnly);
      } catch (err: any) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (token) fetchTransactions();
  }, [token, navigate, logout]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(t => 
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-20">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 md:px-10 py-5 md:py-6 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Category</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Description</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Date</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer">
                  <td className="px-6 md:px-10 py-5 md:py-6">
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="w-10 md:w-12 h-10 md:h-12 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-lg border border-violet-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:scale-110 transition-transform shrink-0">
                        {t.category.charAt(0)}
                      </div>
                      <span className="font-black text-xs md:text-sm text-slate-900 dark:text-white tracking-tight uppercase truncate">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-5 md:py-6">
                    <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate max-w-[200px] block">{t.description || 'N/A'}</span>
                  </td>
                  <td className="px-6 md:px-10 py-5 md:py-6 text-right">
                    <span className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-5 md:py-6 text-right">
                    <div className="flex items-center justify-end gap-2 md:gap-2.5">
                      <ArrowDownCircle className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-violet-600 dark:text-violet-400 shrink-0" />
                      <span className="font-black text-sm md:text-lg text-violet-600 dark:text-violet-400 tracking-tighter whitespace-nowrap">{formatCurrency(t.amount)}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 md:px-10 py-20 md:py-24 text-center">
                    <div className="flex flex-col items-center gap-4 md:gap-6">
                      <div className="w-16 md:w-20 h-16 md:h-20 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600 animate-pulse">
                        <TrendingUp className="w-[28px] h-[28px] md:w-[32px] md:h-[32px]" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">No data available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutflowPage;
