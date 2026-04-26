import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, 
  ArrowUpCircle,
  TrendingUp,
  Search,
  ArrowLeft
} from 'lucide-react';

const InflowPage: React.FC = () => {
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
        const inflowOnly = response.data.filter((t: any) => t.type === 'Income');
        setTransactions(inflowOnly);
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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-rose-500 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Inflow Details <span className="text-emerald-500">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">History of all incoming money</p>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500">
            <Search size={18} />
          </span>
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium dark:text-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800/50">
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                        {t.category.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">{t.description || '-'}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">
                      {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ArrowUpCircle size={14} className="text-emerald-500" />
                      <span className="font-black text-emerald-600">{formatCurrency(t.amount)}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                        <TrendingUp size={32} />
                      </div>
                      <p className="text-slate-400 font-medium italic">No inflow transactions found.</p>
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

export default InflowPage;
