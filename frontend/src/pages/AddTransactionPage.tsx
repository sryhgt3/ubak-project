import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Tag, 
  FileText,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const AddTransactionPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '', // Use string for easier typing
    type: 'Expense',
    category: '',
    description: ''
  });

  const categories = {
    Income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
    Expense: ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Other']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount as string) || 0
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/transactions`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error("Failed to add transaction", error);
      alert("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-500">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 border-b border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
           <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white relative z-10">Add Transaction</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-1 relative z-10 text-sm">Record your daily financial activities</p>
        </div>

        {success ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 size={32} />
             </div>
             <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Transaction Saved!</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">Redirecting you back to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Income', category: ''})}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-sm font-semibold transition-all ${
                  formData.type === 'Income' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <ArrowUpCircle size={18} /> Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Expense', category: ''})}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-sm font-semibold transition-all ${
                  formData.type === 'Expense' 
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <ArrowDownCircle size={18} /> Expense
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-semibold text-xl dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Category</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Tag size={18} />
                </span>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-semibold text-sm appearance-none cursor-pointer dark:text-white"
                >
                  <option value="" disabled className="dark:bg-slate-900">Select Category</option>
                  {(formData.type === 'Income' ? categories.Income : categories.Expense).map(cat => (
                    <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Description</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">
                  <FileText size={18} />
                </span>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-sm min-h-[100px] dark:text-white"
                  placeholder="Optional details..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                'Save Transaction'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTransactionPage;
