import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, 
  Target, 
  ShoppingBag, 
  TrendingDown, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Zap,
  Activity
} from 'lucide-react';
import axios from 'axios';

const SetupModal: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    monthly_income: user?.monthly_income && user.monthly_income !== 0 ? user.monthly_income.toString() : '',
    savings_goal: user?.savings_goal || '',
    dream_item: user?.dream_item || '',
    max_spending: user?.max_spending && user.max_spending !== 0 ? user.max_spending.toString() : ''
  });

  useEffect(() => {
    // Modal component mounted
  }, [user]);

  if (!user || user.role === 'Admin' || user.setup_completed) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const submissionData = {
      ...formData,
      monthly_income: parseInt(formData.monthly_income) || 0,
      max_spending: parseInt(formData.max_spending) || 0
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/me`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser({ ...submissionData, setup_completed: true });
    } catch (error) {
      console.error("Failed to update setup", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Monthly Income",
      description: "How much do you earn each month?",
      icon: <DollarSign className="text-cyan-600 dark:text-cyan-400" size={32} />,
      field: (
        <div className="relative group w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400">IDR</span>
          <input 
            type="text"
            inputMode="numeric"
            value={formData.monthly_income}
            onChange={e => setFormData({...formData, monthly_income: e.target.value.replace(/[^0-9]/g, '')})}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl py-5 md:py-6 pl-16 md:pl-20 pr-6 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-black text-2xl md:text-4xl text-slate-900 dark:text-white tracking-tighter shadow-sm"
            placeholder="0"
          />
        </div>
      )
    },
    {
      title: "Savings Goal",
      description: "What are you saving for?",
      icon: <Target className="text-violet-600 dark:text-violet-400" size={32} />,
      field: (
        <input 
          type="text" 
          value={formData.savings_goal}
          onChange={e => setFormData({...formData, savings_goal: e.target.value})}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl py-5 md:py-6 px-6 md:px-8 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all font-black text-xl md:text-2xl text-slate-900 dark:text-white uppercase tracking-widest placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-sm"
          placeholder="ENTER GOAL..."
        />
      )
    },
    {
      title: "Dream Item",
      description: "What is your dream item?",
      icon: <ShoppingBag className="text-fuchsia-600 dark:text-fuchsia-400" size={32} />,
      field: (
        <input 
          type="text" 
          value={formData.dream_item}
          onChange={e => setFormData({...formData, dream_item: e.target.value})}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl py-5 md:py-6 px-6 md:px-8 focus:ring-1 focus:ring-fuchsia-500/50 outline-none transition-all font-black text-xl md:text-2xl text-slate-900 dark:text-white uppercase tracking-widest placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-sm"
          placeholder="E.G. NEW LAPTOP"
        />
      )
    },
    {
      title: "Max Spending",
      description: "Set your maximum monthly spending.",
      icon: <TrendingDown className="text-rose-600 dark:text-rose-400" size={32} />,
      field: (
        <div className="relative group w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl group-focus-within:text-rose-600 dark:group-focus-within:text-rose-400">IDR</span>
          <input 
            type="text"
            inputMode="numeric"
            value={formData.max_spending}
            onChange={e => setFormData({...formData, max_spending: e.target.value.replace(/[^0-9]/g, '')})}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl py-5 md:py-6 pl-16 md:pl-20 pr-6 focus:ring-1 focus:ring-rose-500/50 outline-none transition-all font-black text-2xl md:text-4xl text-slate-900 dark:text-white tracking-tighter shadow-sm"
            placeholder="0"
          />
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-slate-900/40 dark:bg-black/80">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-xl rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-200 dark:border-white/10 relative">
        {/* Glow Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/10 blur-2xl rounded-full pointer-events-none"></div>
        
        <div className="relative h-1 md:h-1.5 bg-slate-100 dark:bg-white/5">
          <div 
            className="absolute h-full bg-gradient-to-r from-cyan-400 to-violet-600 transition-all duration-700"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-8 md:mb-10">
            <div className="space-y-1 md:space-y-2">
              <p className="text-cyan-600 dark:text-cyan-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-1 md:mb-2 flex items-center gap-2">
                <Activity size={10} /> STEP {step} OF 4
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{currentStep.title}</h2>
              <p className="text-slate-500 mt-1 text-xs md:text-sm font-medium">{currentStep.description}</p>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              {React.cloneElement(currentStep.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
            </div>
          </div>

          <div className="min-h-[100px] flex items-center">
            {currentStep.field}
          </div>

          <div className="mt-10 md:mt-12 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] md:text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> Previous
              </button>
            ) : <div />}

            {step < steps.length ? (
              <button 
                onClick={handleNext}
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3.5 md:py-4 rounded-full font-black text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 uppercase tracking-widest"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-400 to-violet-600 text-white px-8 py-3.5 md:py-4 rounded-full font-black text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg dark:shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center gap-2 disabled:opacity-50 uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>Finish Setup <Zap size={16} fill="currentColor" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupModal;
