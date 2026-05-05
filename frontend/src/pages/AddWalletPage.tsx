import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Wallet, 
  ShieldAlert, 
  Loader2,
  CheckCircle2,
  Plus,
  Activity,
  CreditCard,
  Banknote,
  Coins
} from 'lucide-react';

const AddWalletPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cash',
    balance: '',
    max_spending: ''
  });

  const walletTypes = [
    { id: 'Bank', icon: <CreditCard size={18} />, label: 'Bank' },
    { id: 'EWallet', icon: <Banknote size={18} />, label: 'E-Wallet' },
    { id: 'Cash', icon: <Coins size={18} />, label: 'Cash' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const submissionData = {
      ...formData,
      balance: parseFloat(formData.balance) || 0,
      max_spending: formData.max_spending ? parseInt(formData.max_spending) : null
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/api/accounts/`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Wallet added successfully!");
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Failed to add wallet.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-1000 pb-20 px-4 sm:px-0 text-slate-900 dark:text-white selection:bg-cyan-500/30">
      
      {/* Background Ambient Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-slate-50 dark:bg-[#030303]">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full" />
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl dark:shadow-2xl overflow-hidden relative group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500">
        <div className="bg-slate-50 dark:bg-white/5 p-8 md:p-10 border-b border-slate-200 dark:border-white/5 relative overflow-hidden text-slate-900 dark:text-white">
           <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-2xl rounded-full"></div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-4 relative z-10">
             <Activity size={10} /> Management
           </div>
           <h2 className="text-3xl md:text-4xl font-black tracking-tighter relative z-10 uppercase text-slate-900 dark:text-white">Add Wallet<span className="text-violet-400">.</span></h2>
           <p className="text-slate-500 mt-2 relative z-10 text-[10px] md:text-sm font-medium">Create a new wallet to track your money.</p>
        </div>

        {success ? (
          <div className="p-16 md:p-24 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center border border-violet-500/30 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-in zoom-in duration-500">
                <CheckCircle2 className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Wallet Added!</h3>
               <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest">Redirecting...</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 md:space-y-8">
            {error && (
               <div className="p-3 md:p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-shake shadow-sm dark:shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                  <ShieldAlert size={16} className="shrink-0" /> {error}
               </div>
            )}

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Wallet Name</label>
              <div className="relative group/input">
                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-violet-500 transition-colors">
                  <Wallet className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                </span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-sm"
                  placeholder="E.G. MAIN WALLET, SAVINGS"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Wallet Type</label>
              <div className="grid grid-cols-3 gap-3">
                 {walletTypes.map((type) => (
                    <button
                       key={type.id}
                       type="button"
                       onClick={() => setFormData({...formData, type: type.id})}
                       className={`py-3 flex flex-col items-center gap-2 rounded-xl border-2 font-black text-[9px] uppercase tracking-tighter transition-all ${
                          formData.type === type.id 
                             ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-sm' 
                             : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-500 hover:border-slate-200'
                       }`}
                    >
                       {type.icon}
                       {type.label}
                    </button>
                 ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Initial Balance</label>
              <div className="relative group/input">
                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs md:text-sm group-focus-within/input:text-violet-500 transition-colors">
                  IDR
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: e.target.value.replace(/[^0-9.]/g, '')})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all font-black text-xl text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Max Spending Limit (Optional)</label>
              <div className="relative group/input">
                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs md:text-sm group-focus-within/input:text-violet-500 transition-colors">
                  IDR
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.max_spending}
                  onChange={(e) => setFormData({...formData, max_spending: e.target.value.replace(/[^0-9]/g, '')})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-4 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all font-black text-xl text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                  placeholder="No limit"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-[11px] md:text-sm uppercase tracking-[0.3em] shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <><Plus size={20} /> Add Wallet</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddWalletPage;
