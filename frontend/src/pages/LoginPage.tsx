import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Loader2, ArrowLeft, Zap, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/login`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { access_token, role, setup_completed } = response.data;
      
      login(access_token, role, username, setup_completed);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#030303] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 md:gap-3 text-slate-500 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all group z-20"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 md:group-hover:-translate-x-2 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-8 md:p-10 w-full max-w-md relative z-10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 my-12">
        <div className="text-center mb-8 md:mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none"></div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 md:mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)] relative z-10">
            <Zap size={24} className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]" fill="currentColor" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter relative z-10 uppercase">Login<span className="text-cyan-400">.</span></h2>
          <p className="text-slate-500 mt-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] relative z-10">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 md:p-4 rounded-2xl mb-6 md:mb-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <ShieldAlert size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <label className="block text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ml-1">Username</label>
            <div className="relative group">
              <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                <User className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 md:pr-6 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-bold text-[11px] md:text-xs tracking-widest uppercase placeholder:text-slate-700"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="block text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ml-1">Password</label>
            <div className="relative group">
              <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                <Lock className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 md:pr-6 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/10 transition-all font-bold text-[11px] md:text-xs tracking-widest placeholder:text-slate-700"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-white text-black font-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] uppercase tracking-[0.3em] text-xs md:text-sm transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/5">
          <p className="text-center text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-6">Demo Accounts</p>
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors px-4 py-2.5 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs group">
              <span className="font-black text-white uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Admin</span>
              <span className="text-slate-500 font-bold tracking-widest">admin / admin123</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors px-4 py-2.5 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs group">
              <span className="font-black text-white uppercase tracking-widest group-hover:text-violet-400 transition-colors">VIP</span>
              <span className="text-slate-500 font-bold tracking-widest">vip_user / vip123</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/20 transition-colors px-4 py-2.5 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs group">
              <span className="font-black text-white uppercase tracking-widest transition-colors">Standard</span>
              <span className="text-slate-500 font-bold tracking-widest">free_user / free123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
