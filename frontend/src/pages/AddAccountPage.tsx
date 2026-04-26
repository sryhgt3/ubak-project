import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  ShieldCheck, 
  Loader2,
  CheckCircle2,
  UserPlus
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
      setError(err.response?.data?.detail || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-rose-500 font-bold transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Console
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden transition-colors duration-500">
        <div className="bg-slate-900 dark:bg-white p-10 text-white dark:text-slate-900 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
           <h2 className="text-3xl font-extrabold tracking-tight relative z-10">New Account</h2>
           <p className="opacity-60 mt-2 relative z-10 font-medium text-sm uppercase tracking-widest">Platform Administration</p>
        </div>

        {success ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Account Created!</h3>
             <p className="text-slate-500">The user can now login with password "123".</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {error && (
               <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-2 animate-shake">
                  <ShieldCheck size={16} /> {error}
               </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold dark:text-white"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Account Role</label>
              <div className="grid grid-cols-2 gap-4">
                 {['VIP', 'Free'].map((role) => (
                    <button
                       key={role}
                       type="button"
                       onClick={() => setFormData({...formData, role})}
                       className={`py-4 rounded-2xl border-2 font-bold transition-all ${
                          formData.role === role 
                             ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600' 
                             : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400'
                       }`}
                    >
                       {role}
                    </button>
                 ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Security Note</p>
               <p className="text-sm text-slate-400 font-medium">Default password is set to <span className="text-rose-500 font-bold">123</span>. Users should change this after first login.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <><UserPlus size={20} /> Create Account</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAccountPage;
