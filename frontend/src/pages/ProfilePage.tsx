import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  DollarSign, 
  Target, 
  ShoppingBag, 
  TrendingDown, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Activity
} from 'lucide-react';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    username: user?.username || '',
    monthly_income: user?.monthly_income && user.monthly_income !== 0 ? user.monthly_income.toString() : '',
    savings_goal: user?.savings_goal || '',
    dream_item: user?.dream_item || '',
    max_spending: user?.max_spending && user.max_spending !== 0 ? user.max_spending.toString() : ''
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    const submissionData = {
      ...formData,
      monthly_income: parseInt(formData.monthly_income) || 0,
      max_spending: parseInt(formData.max_spending) || 0
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/me`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(submissionData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Update failed' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-24 md:pb-32 px-4 sm:px-0 text-white selection:bg-cyan-500/30">
      {/* Background Ambient Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-[#030303]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20 pt-4 md:pt-8">
        <div className="space-y-2 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[8px] md:text-[10px] font-bold tracking-widest uppercase w-fit">
            <User size={12} /> Account Info
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">
            Profile Settings<span className="text-violet-400">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-medium">Manage your account details and financial goals.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest relative z-20 ${
          message.type === 'success' 
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
        {/* Account Info */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl space-y-6 md:space-y-8 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-violet-500/20 transition-colors"></div>
          
          <div className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-[10px] md:text-xs uppercase tracking-widest relative z-10">
            <div className="w-10 h-10 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center border border-violet-500/20">
              <Activity size={18} />
            </div>
            Base Information
          </div>
          
          <div className="space-y-3 relative z-10">
            <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Username</label>
            <div className="relative group/input">
               <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors">
                 <Zap className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" fill="currentColor" />
               </span>
               <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all font-bold text-xs uppercase tracking-widest text-white placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="pt-4 relative z-10">
            <div className="bg-white/5 p-5 rounded-2xl md:rounded-3xl border border-white/10">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">Account Role</span>
              <span className="text-white font-black text-base md:text-lg tracking-tight uppercase">{user?.role} LEVEL</span>
            </div>
          </div>
        </div>

        {/* Financial Goals */}
        {user?.role !== 'Admin' && (
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl space-y-6 md:space-y-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors"></div>
            
            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-[10px] md:text-xs uppercase tracking-widest relative z-10">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-500/20">
                <Target size={18} />
              </div>
              Financial Settings
            </div>

            <div className="space-y-5 md:space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                  <DollarSign size={12} /> Monthly Income
                </label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={formData.monthly_income}
                  onChange={e => setFormData({...formData, monthly_income: e.target.value.replace(/[^0-9]/g, '')})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-3.5 px-5 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-xs text-white"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                  <Target size={12} /> Savings Goal
                </label>
                <input 
                  type="text" 
                  value={formData.savings_goal}
                  onChange={e => setFormData({...formData, savings_goal: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-3.5 px-5 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-xs text-white uppercase tracking-widest"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                  <ShoppingBag size={12} /> Dream Item
                </label>
                <input 
                  type="text" 
                  value={formData.dream_item}
                  onChange={e => setFormData({...formData, dream_item: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-3.5 px-5 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-xs text-white uppercase tracking-widest"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                  <TrendingDown size={12} /> Max Spending
                </label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={formData.max_spending}
                  onChange={e => setFormData({...formData, max_spending: e.target.value.replace(/[^0-9]/g, '')})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-3.5 px-5 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end relative z-20 pt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto bg-white text-black px-10 md:px-12 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-[11px] md:text-sm uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
