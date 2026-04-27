import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, 
  Target, 
  ShoppingBag, 
  TrendingDown, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const SetupModal: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use string for inputs to handle empty state while typing
  const [formData, setFormData] = useState({
    monthly_income: user?.monthly_income && user.monthly_income !== 0 ? user.monthly_income.toString() : '',
    savings_goal: user?.savings_goal || '',
    dream_item: user?.dream_item || '',
    max_spending: user?.max_spending && user.max_spending !== 0 ? user.max_spending.toString() : ''
  });

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
      icon: <DollarSign className="text-emerald-500" size={32} />,
      field: (
        <div className="relative group w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
          <input 
            type="text"
            inputMode="numeric"
            value={formData.monthly_income}
            onChange={e => setFormData({...formData, monthly_income: e.target.value.replace(/[^0-9]/g, '')})}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg dark:text-white"
            placeholder="0"
          />
        </div>
      )
    },
    {
      title: "Savings Goal",
      description: "What are you saving for? (e.g., Emergency Fund, Education)",
      icon: <Target className="text-rose-500" size={32} />,
      field: (
        <input 
          type="text" 
          value={formData.savings_goal}
          onChange={e => setFormData({...formData, savings_goal: e.target.value})}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg dark:text-white"
          placeholder="Enter your goal"
        />
      )
    },
    {
      title: "Dream Item",
      description: "What's that one thing you really want to buy?",
      icon: <ShoppingBag className="text-purple-500" size={32} />,
      field: (
        <input 
          type="text" 
          value={formData.dream_item}
          onChange={e => setFormData({...formData, dream_item: e.target.value})}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg dark:text-white"
          placeholder="e.g., iPhone 15 Pro, New Laptop"
        />
      )
    },
    {
      title: "Max Spending",
      description: "Set your monthly spending limit to stay on track.",
      icon: <TrendingDown className="text-orange-500" size={32} />,
      field: (
        <div className="relative group w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
          <input 
            type="text"
            inputMode="numeric"
            value={formData.max_spending}
            onChange={e => setFormData({...formData, max_spending: e.target.value.replace(/[^0-9]/g, '')})}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg dark:text-white"
            placeholder="0"
          />
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
        <div className="relative h-1.5 bg-slate-100 dark:bg-slate-800">
          <div 
            className="absolute h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-rose-500 font-semibold text-[10px] uppercase tracking-wider mb-2">Step {step} of 4</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">{currentStep.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{currentStep.description}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              {React.cloneElement(currentStep.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
            </div>
          </div>

          <div className="min-h-[80px] flex items-center">
            {currentStep.field}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
            ) : <div />}

            {step < steps.length ? (
              <button 
                onClick={handleNext}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-sm flex items-center gap-2 group"
              >
                Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-rose-500 text-white px-8 py-2.5 rounded-xl font-medium text-sm hover:bg-rose-600 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>Finish Setup <CheckCircle2 size={18} /></>
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
