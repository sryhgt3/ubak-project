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
    monthly_income: user?.monthly_income || 0,
    savings_goal: user?.savings_goal || '',
    dream_item: user?.dream_item || '',
    max_spending: user?.max_spending || 0
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.put('http://localhost:8800/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your account details and financial goals</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Info */}
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-slate-900 font-bold mb-2">
            <User size={20} className="text-rose-500" />
            Account Information
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium"
            />
          </div>

          <div className="pt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">User Role</span>
              <span className="text-slate-900 font-bold">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Financial Goals (Visible only for non-admins) */}
        {user?.role !== 'Admin' && (
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-900 font-bold mb-2">
              <Target size={20} className="text-purple-500" />
              Financial Settings
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                  <DollarSign size={14} /> Monthly Income
                </label>
                <input 
                  type="number" 
                  value={formData.monthly_income}
                  onChange={e => setFormData({...formData, monthly_income: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                  <Target size={14} /> Savings Goal
                </label>
                <input 
                  type="text" 
                  value={formData.savings_goal}
                  onChange={e => setFormData({...formData, savings_goal: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                  <ShoppingBag size={14} /> Dream Item
                </label>
                <input 
                  type="text" 
                  value={formData.dream_item}
                  onChange={e => setFormData({...formData, dream_item: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
                  <TrendingDown size={14} /> Max Monthly Spending
                </label>
                <input 
                  type="number" 
                  value={formData.max_spending}
                  onChange={e => setFormData({...formData, max_spending: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <><Save size={20} /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
