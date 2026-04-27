import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  ShieldAlert, 
  Loader2,
  CheckCircle2,
  UserPlus,
  Activity
} from 'lucide-react';

const AddAccountPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Free',
    password: '123'
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/accounts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-20 px-4 sm:px-0 text-white selection:bg-cyan-500/30">
      
      {/* Background Ambient Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-[#030303]">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 text-slate-500 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden relative group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500">
        <div className="bg-white/5 p-8 md:p-10 border-b border-white/5 relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full"></div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-4 relative z-10">
             <Activity size={10} /> Add User
           </div>
           <h2 className="text-3xl md:text-4xl font-black tracking-tighter relative z-10 uppercase">New Account<span className="text-cyan-400">.</span></h2>
           <p className="text-slate-500 mt-2 relative z-10 text-[10px] md:text-sm font-medium">Create a new user account.</p>
        </div>

        {success ? (
          <div className="p-16 md:p-24 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-in zoom-in duration-500">
                <CheckCircle2 className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">User Created!</h3>
               <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest">Redirecting...</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 md:space-y-8">
            {error && (
               <div className="p-3 md:p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-shake shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                  <ShieldAlert size={16} className="shrink-0" /> {error}
               </div>
            )}

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Username</label>
              <div className="relative group/input">
                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                  <User className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                </span>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-xs uppercase tracking-widest text-white placeholder:text-slate-700"
                  placeholder="USERNAME"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Email Address</label>
              <div className="relative group/input">
                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                  <Mail className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-6 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-bold text-xs text-white placeholder:text-slate-700"
                  placeholder="EMAIL@EXAMPLE.COM"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Account Role</label>
              <div className="grid grid-cols-2 gap-4">
                 {['VIP', 'Free'].map((role) => (
                    <button
                       key={role}
                       type="button"
                       onClick={() => setFormData({...formData, role})}
                       className={`py-3 md:py-4 rounded-xl md:rounded-2xl border-2 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${
                          formData.role === role 
                             ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                             : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                       }`}
                    >
                       {role} Level
                    </button>
                 ))}
              </div>
            </div>

            <div className="bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10">
               <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Security Note</p>
               <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed">Default password is set to <span className="text-cyan-400 font-bold tracking-widest">123</span>. New users must reset their password upon first login.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-[11px] md:text-sm uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-2 md:mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <><UserPlus size={20} /> Create User</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAccountPage;
