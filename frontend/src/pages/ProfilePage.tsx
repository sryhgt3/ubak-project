import React, { useState } from 'react';
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
  AlertCircle
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
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account details and financial goals</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20' 
            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-sm mb-2">
            <User size={18} className="text-rose-500" />
            Account Information
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-sm dark:text-white"
            />
          </div>

          <div className="pt-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">User Role</span>
              <span className="text-slate-900 dark:text-white font-semibold text-sm">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Financial Goals (Visible only for non-admins) */}
        {user?.role !== 'Admin' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-sm mb-2">
              <Target size={18} className="text-purple-500" />
              Financial Settings
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                  <DollarSign size={14} /> Monthly Income
                </label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={formData.monthly_income}
                  onChange={e => setFormData({...formData, monthly_income: e.target.value.replace(/[^0-9]/g, '')})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                  <Target size={14} /> Savings Goal
                </label>
                <input 
                  type="text" 
                  value={formData.savings_goal}
                  onChange={e => setFormData({...formData, savings_goal: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                  <ShoppingBag size={14} /> Dream Item
                </label>
                <input 
                  type="text" 
                  value={formData.dream_item}
                  onChange={e => setFormData({...formData, dream_item: e.target.value})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                  <TrendingDown size={14} /> Max Monthly Spending
                </label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={formData.max_spending}
                  onChange={e => setFormData({...formData, max_spending: e.target.value.replace(/[^0-9]/g, '')})}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-sm dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
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
