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
  const [formData, setFormData] = useState({
    monthly_income: user?.monthly_income || 0,
    savings_goal: user?.savings_goal || '',
    dream_item: user?.dream_item || '',
    max_spending: user?.max_spending || 0
  });

  if (!user || user.role === 'Admin' || user.setup_completed) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.put('http://localhost:8800/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser({ ...formData, setup_completed: true });
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
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
          <input 
            type="number" 
            value={formData.monthly_income}
            onChange={e => setFormData({...formData, monthly_income: parseInt(e.target.value) || 0})}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg"
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
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg"
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
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg"
          placeholder="e.g., iPhone 15 Pro, New Laptop"
        />
      )
    },
    {
      title: "Max Spending",
      description: "Set your monthly spending limit to stay on track.",
      icon: <TrendingDown className="text-orange-500" size={32} />,
      field: (
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
          <input 
            type="number" 
            value={formData.max_spending}
            onChange={e => setFormData({...formData, max_spending: parseInt(e.target.value) || 0})}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg"
            placeholder="0"
          />
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative h-2 bg-slate-100">
          <div 
            className="absolute h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-rose-500 font-bold text-sm uppercase tracking-widest mb-2">Step {step} of 4</p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{currentStep.title}</h2>
              <p className="text-slate-500 mt-2 font-medium">{currentStep.description}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-[2rem] shadow-inner">
              {currentStep.icon}
            </div>
          </div>

          <div className="min-h-[100px] flex items-center">
            {currentStep.field}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                <ArrowLeft size={20} /> Back
              </button>
            ) : <div />}

            {step < steps.length ? (
              <button 
                onClick={handleNext}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 group"
              >
                Next Step <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Finish Setup <CheckCircle2 size={20} /></>
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
