import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';

const AddTransactionPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    description: ''
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

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
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-20 px-4 sm:px-0 text-white selection:bg-cyan-500/30">
      
      {/* Background Ambient Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-[#030303]">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 text-slate-500 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden relative group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500">
        <div className="bg-white/5 p-8 md:p-10 border-b border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full"></div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-4 relative z-10">
             <Zap size={10} fill="currentColor" /> Add Transaction
           </div>
           <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white relative z-10 uppercase">New Transaction<span className="text-cyan-400">.</span></h2>
           <p className="text-slate-500 mt-2 relative z-10 text-[10px] md:text-sm font-medium">Record your income and expenses</p>
        </div>

        {success ? (
          <div className="p-16 md:p-24 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-in zoom-in duration-500">
                <CheckCircle2 className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Success!</h3>
               <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest">Redirecting...</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 md:space-y-8">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Income', category: ''})}
                className={`py-3 md:py-4 rounded-xl md:rounded-2xl border-2 flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                  formData.type === 'Income' 
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                <ArrowUpCircle className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /> <span className="hidden sm:inline">Income</span><span className="sm:hidden">In</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'Expense', category: ''})}
                className={`py-3 md:py-4 rounded-xl md:rounded-2xl border-2 flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                  formData.type === 'Expense' 
                    ? 'border-violet-500 bg-violet-500/10 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                <ArrowDownCircle className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /> <span className="hidden sm:inline">Expense</span><span className="sm:hidden">Out</span>
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Amount</label>
              <div className="relative group/input">
                <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg md:text-xl group-focus-within/input:text-cyan-400 transition-colors">IDR</span>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] py-4 md:py-6 pl-16 md:pl-20 pr-4 md:pr-6 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all font-black text-2xl md:text-4xl text-white tracking-tighter"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category & Description Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Category</label>
                  <div className="relative group/input">
                    <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                      <Tag className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                    </span>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-6 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-black text-[10px] md:text-xs uppercase tracking-widest appearance-none cursor-pointer text-white"
                    >
                      <option value="" disabled className="bg-[#0a0a0a]">SELECT CATEGORY</option>
                      {(formData.type === 'Income' ? categories.Income : categories.Expense).map(cat => (
                        <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Description</label>
                  <div className="relative group/input">
                    <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                      <FileText className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                    </span>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-[10px] md:text-xs text-white placeholder:text-slate-700 tracking-wider"
                      placeholder="DESCRIPTION..."
                    />
                  </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-2 md:mt-4 text-[11px] md:text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                  Saving...
                </>
              ) : (
                <>
                  <Target className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /> Save Transaction
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTransactionPage;
