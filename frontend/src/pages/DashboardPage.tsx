import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Crown, 
  UserCircle, 
  Loader2, 
  Settings, 
  Zap, 
  Database,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, token, logout, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !token) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get('http://localhost:8800/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
      } catch (err: any) {
        setError('Failed to fetch dashboard data. Your session may have expired.');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (token) fetchDashboard();
  }, [token, isLoading, navigate, logout]);

  if (isLoading || isFetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
          <Loader2 className="absolute inset-0 m-auto text-rose-500 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-3xl flex items-center gap-4 shadow-xl shadow-rose-100/50 font-medium">
          <ShieldCheck size={24} />
          {error}
        </div>
      )}

      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-rose-300 mb-6">
              <TrendingUp size={14} />
              System Status: Active
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">{user?.username}</span>!
            </h1>
            <p className="text-slate-300 text-lg font-medium max-w-xl leading-relaxed">
              You are currently exploring the platform with <span className="text-white font-bold">{user?.role}</span> privileges. 
              {user?.role === 'Free' ? ' Upgrade to VIP to unlock more features.' : ' All premium systems are online.'}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl text-sm font-bold shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
              View Analytics <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            {user?.role === 'Free' && (
              <button className="bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-300 px-8 py-4 rounded-2xl text-sm font-bold hover:bg-rose-500/30 transition-all">
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Public Card */}
        <div className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
          <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl w-fit mb-6 shadow-inner group-hover:scale-110 transition-transform">
            <UserCircle size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Public Overview</h3>
          <p className="text-slate-500 leading-relaxed font-medium mb-6">{dashboardData?.message}</p>
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Accessibility</span>
            <span className="text-emerald-500">Public</span>
          </div>
        </div>

        {/* VIP/Admin Card */}
        {(user?.role === 'VIP' || user?.role === 'Admin') && (
          <div className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Crown className="text-purple-500 opacity-5 group-hover:opacity-10 transition-opacity" size={120} />
            </div>
            <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl w-fit mb-6 shadow-inner group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Exclusive Perks</h3>
            <p className="text-slate-500 leading-relaxed font-medium mb-6">
              {dashboardData?.vip_perks || "As an elevated user, you have access to priority processing and early beta features."}
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all w-full">
              Explore VIP Assets
            </button>
          </div>
        )}

        {/* Admin Card */}
        {user?.role === 'Admin' && (
          <div className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
              <ShieldCheck className="text-rose-500 opacity-5 group-hover:opacity-10 transition-opacity" size={120} />
            </div>
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl w-fit mb-6 shadow-inner group-hover:scale-110 transition-transform">
              <Database size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">System Metrics</h3>
            <p className="text-slate-500 leading-relaxed font-medium mb-6">{dashboardData?.admin_stats}</p>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-slate-400">System Load</span>
                  <span className="text-emerald-500">Optimal</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full w-[42%]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Free-User Upgrade */}
        {user?.role === 'Free' && (
          <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center group">
            <div className="w-16 h-16 bg-white text-slate-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-rose-50 group-hover:text-rose-300 transition-colors shadow-sm">
              <Crown size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2 group-hover:text-rose-500 transition-colors">Unlock VIP Access</h3>
            <p className="text-sm text-slate-400 font-medium mb-6 max-w-[200px]">{dashboardData?.free_status}</p>
            <button className="text-rose-500 hover:text-rose-600 font-bold text-sm underline underline-offset-4 decoration-2">
              View Upgrade Options
            </button>
          </div>
        )}
      </div>

      {/* Admin Action Bar */}
      {user?.role === 'Admin' && (
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-wrap gap-6 items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-slate-900">Administrative Console</h4>
            <p className="text-slate-500 font-medium">Configure global security policies and manage user roles</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all">
              <Settings size={18} /> User Management
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-slate-900/10">
              System Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
