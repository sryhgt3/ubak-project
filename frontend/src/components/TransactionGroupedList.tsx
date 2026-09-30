import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronRight, Edit2, Save, X, TrendingUp, Trash2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
  type: 'Income' | 'Expense';
  onRefresh: () => void;
  searchTerm: string;
  dateFilter: string; // Moved up
}

const TransactionGroupedList: React.FC<Props> = ({ transactions, type, onRefresh, searchTerm, dateFilter }) => {
  const { token } = useAuth();
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction> & { displayAmount: string }>({ displayAmount: '' });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const toggleDate = (dateStr: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const categories = {
    Income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
    Expense: ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Other']
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatToDot = (val: string) => {
    const numericStr = val.replace(/\D/g, '');
    if (!numericStr) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numericStr));
  };

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchDate = true;
      if (dateFilter) {
        const tDate = new Date(t.date).toISOString().split('T')[0];
        matchDate = tDate === dateFilter;
      }
      
      return matchSearch && matchDate;
    });
  }, [transactions, searchTerm, dateFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    
    filtered.forEach(t => {
      // Extract YYYY-MM-DD reliably ignoring timezone shifts
      const datePart = t.date.split('T')[0]; // "2026-09-23"
      const [year, month, day] = datePart.split('-');
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();

      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(t);
    });
    
    return Object.keys(groups).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    }).reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [filtered]);

  const handleEditClick = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: t.date.split('T')[0],
      displayAmount: formatToDot(t.amount.toString())
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ displayAmount: '' });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const numericAmount = Number(editForm.displayAmount?.replace(/\D/g, ''));
      const payload = {
        ...editForm,
        amount: numericAmount
      };
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/transactions/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Transaction updated successfully!");
      setEditingId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setIsDeleting(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Transaction deleted successfully!");
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction.");
    } finally {
      setIsDeleting(null);
    }
  };

  
  const colorClass = type === 'Income' ? 'text-cyan-600 dark:text-cyan-400' : 'text-violet-600 dark:text-violet-400';
  const bgLightClass = type === 'Income' ? 'bg-cyan-500/10' : 'bg-violet-500/10';

  return (
    <div className="space-y-6">
      {Object.keys(grouped).length === 0 ? (
        <div className="py-20 text-center bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 rounded-[2.5rem]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
              <TrendingUp className="w-7 h-7" />
            </div>
            <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">No data available</p>
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([dateStr, txs]) => (
          <div key={dateStr} className="bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] border border-white/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
            {/* Header / Trigger */}
            <button 
              onClick={() => toggleDate(dateStr)}
              className="w-full flex items-center justify-between p-5 md:p-6 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/50 dark:hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedDates[dateStr] === false ? <ChevronRight className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white tracking-widest">{dateStr}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">{txs.length} Transactions</span>
                <span className={`font-black text-sm md:text-base ${colorClass}`}>
                  {formatCurrency(txs.reduce((sum, t) => sum + t.amount, 0))}
                </span>
              </div>
            </button>

            {/* List */}
            {expandedDates[dateStr] !== false && (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {txs.map(t => (
                  <div key={t.id} className="p-5 md:p-6 group hover:bg-white/50 dark:hover:bg-white/[0.03] transition-colors relative">
                    {editingId === t.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-3">
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-xs font-bold text-slate-800 dark:text-white"
                          >
                            {(type === 'Income' ? categories.Income : categories.Expense).map(cat => (
                              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-3">
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-xs font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            placeholder="Description..."
                            className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-xs font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={editForm.displayAmount}
                            onChange={(e) => setEditForm({...editForm, displayAmount: formatToDot(e.target.value)})}
                            className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-xs font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end gap-2">
                          <button onClick={() => handleSaveEdit(t.id)} className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20"><Save className="w-4 h-4" /></button>
                          <button onClick={handleCancelEdit} className="p-2 bg-slate-500/10 text-slate-600 rounded-lg hover:bg-slate-500/20"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 md:w-12 md:h-12 ${bgLightClass} ${colorClass} rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg border border-white/5`}>
                            {t.category.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-sm md:text-base text-slate-900 dark:text-white uppercase">{t.category}</h4>
                            <p className="text-xs text-slate-500 truncate max-w-[250px]">{t.description || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8">
                          <span className={`font-black text-base md:text-xl ${colorClass}`}>
                            {formatCurrency(t.amount)}
                          </span>
                          <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(t)}
                              className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
                              title="Edit Transaction"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              disabled={isDeleting === t.id}
                              className="p-2 bg-red-500/10 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionGroupedList;
