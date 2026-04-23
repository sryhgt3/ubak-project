import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Crown, User, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold mb-8 animate-fade-in">
          <Shield size={16} />
          <span>Enterprise Grade Security</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 text-center leading-tight">
          Next-Gen <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">UBAK Pro</span>
        </h1>
        
        <p className="text-xl mb-10 text-center max-w-2xl text-slate-600 font-medium leading-relaxed">
          Experience a highly secure access control system built with precision. 
          Manage users, roles, and permissions with an elegant, intuitive interface.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link 
            to="/login" 
            className="group bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl shadow-rose-500/25 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Access Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="bg-white/60 backdrop-blur-md border border-slate-200 hover:bg-white text-slate-700 font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
            Documentation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="group bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 transition-all duration-300 hover:scale-[1.02] hover:bg-white/60">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
              <User size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Free Tier</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Start with the basics. Access public statistics, manage your profile, and explore our secure platform.
            </p>
          </div>

          <div className="group bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 transition-all duration-300 hover:scale-[1.02] hover:bg-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8" />
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Crown size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">VIP Tier</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Elevate your experience with exclusive rewards, premium content access, and priority support.
            </p>
          </div>

          <div className="group bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 transition-all duration-300 hover:scale-[1.02] hover:bg-white/60">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
              <Shield size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Admin Tier</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Full system control. Manage users, view advanced metrics, and configure global security policies.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-24 text-slate-400 text-sm font-medium">
        &copy; 2026 UBAK Pro. Built with Elegance.
      </footer>
    </div>
  );
};

export default LandingPage;
