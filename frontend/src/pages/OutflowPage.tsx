import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, 
  ArrowDownCircle,
  TrendingDown,
  Search,
  ArrowLeft
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
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="text-rose-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Outflow Details<span className="text-rose-500">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">History of all outgoing money</p>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500">
            <Search size={16} />
          </span>
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl py-2 pl-12 pr-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm font-medium dark:text-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Date</th>
                <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-lg flex items-center justify-center font-semibold text-sm border border-rose-100 dark:border-rose-500/20">
                        {t.category.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">{t.description || '-'}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <ArrowDownCircle size={14} className="text-rose-500" />
                      <span className="font-semibold text-sm text-rose-600">{formatCurrency(t.amount)}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                        <TrendingDown size={24} />
                      </div>
                      <p className="text-slate-400 text-sm font-medium italic">No outflow transactions found.</p>
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
