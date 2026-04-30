import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  Sparkles,
  Activity,
  Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/10 selection:text-cyan-200 overflow-x-hidden font-sans">
      
      

      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[70%] h-[60%] bg-violet-200/50 dark:bg-violet-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[70%] h-[60%] bg-cyan-200/50 dark:bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      

      {/* Floating Navigation */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-xl border-b border-white/5 bg-[#030303]/50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
            UBAK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">(UANG BIJAK)</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
            <Link to="/login" className="hidden md:flex text-sm font-bold text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
            <Link to="/login" className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-black hover:scale-105 transition-all shadow-md dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-32 px-4">
        <div className="relative z-20 text-center max-w-6xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 text-cyan-600 dark:text-cyan-400 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 md:mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-sm">
            <Sparkles size={14} /> The Ultimate Finance Dashboard
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            FAST AND <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-600 to-fuchsia-600">SECURE FINANCE.</span>
          </h1>

          <p className="text-base md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-10 md:l-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            Manage your money with ease. A modern, fast, and beautiful dashboard designed to give you complete control over your finances.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 px-4">
            <Link 
              to="/login" 
              className="group bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-black py-4 md:py-5 px-8 md:px-12 rounded-full transition-all duration-300 shadow-xl dark:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-2xl dark:hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-base md:text-lg"
            >
              Get Started <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Abstract 3D Dashboard Mockup Elements */}
        <div className="mt-16 md:mt-24 w-full max-w-6xl relative h-[30vh] sm:h-[40vh] md:h-[50vh] perspective-1000 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-700">
           <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10 pointer-events-none"></div>
           <div className="w-full h-full bg-[#0a0a0a]/80 border border-white/10 rounded-t-[2rem] md:rounded-t-[3rem] backdrop-blur-2xl transform rotateX-[25deg] shadow-[0_-30px_70px_rgba(139,92,246,0.3)] overflow-hidden flex flex-col p-4 md:p-8 gap-4 md:gap-6 pointer-events-none">
              {/* Fake UI Inside */}
              <div className="flex justify-between items-center opacity-50 border-b border-white/5 pb-4 md:pb-6">
                 <div className="h-6 md:h-8 w-24 md:w-32 bg-slate-100 dark:bg-white/10 rounded-lg"></div>
                 <div className="flex gap-3 md:gap-4">
                    <div className="h-6 md:h-8 w-6 md:w-8 bg-slate-100 dark:bg-white/10 rounded-full"></div>
                    <div className="h-6 md:h-8 w-16 md:w-24 bg-cyan-500/10 rounded-full"></div>
                 </div>
              </div>
              <div className="flex gap-4 md:gap-6 opacity-60">
                 <div className="w-1/3 space-y-4 md:space-y-6">
                    <div className="h-24 md:h-40 w-full bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-500/20 dark:to-transparent rounded-[1.5rem] md:rounded-[2rem] border border-cyan-100 dark:border-cyan-500/30"></div>
                    <div className="h-24 md:h-40 w-full bg-slate-50 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-white/10"></div>
                 </div>
                 <div className="w-2/3 space-y-4 md:space-y-6">
                    <div className="h-20 md:h-32 w-full bg-gradient-to-br from-violet-50 to-white dark:from-violet-500/20 dark:to-transparent rounded-[1.5rem] md:rounded-[2rem] border border-violet-100 dark:border-violet-500/30"></div>
                    <div className="h-32 md:h-48 w-full bg-slate-50 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-white/10 flex items-end p-4 md:p-6 gap-2 md:gap-4">
                        {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-cyan-400 to-transparent rounded-t-lg md:rounded-t-xl" style={{height: `${h}%`}}></div>
                        ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="py-6 md:py-8 border-y border-white/5 bg-[#0a0a0a] flex overflow-hidden whitespace-nowrap relative z-20 backdrop-blur-sm">
         <div className="animate-[marquee_20s_linear_infinite] flex gap-12 md:gap-16 items-center">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="text-lg md:text-3xl font-black text-slate-200 dark:text-white/10 uppercase tracking-widest flex items-center gap-6 md:gap-8">
                 UBAK (UANG BIJAK) <Zap className="text-cyan-500/20 dark:text-cyan-500/30" />
              </span>
            ))}
         </div>
      </div>

      {/* Bento Grid Features Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
         <div className="mb-16 md:mb-24 text-center">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white">
              BUILT FOR <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">COMPLETE CONTROL.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-xl max-w-3xl mx-auto font-medium">Stop using outdated tools. We built a modern financial management system designed to help you track and grow your wealth effortlessly.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[350px]">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 hover:border-cyan-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[400px] md:min-h-0 shadow-2xl">
               <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/20 blur-[100px] group-hover:bg-cyan-500/10 dark:group-hover:bg-cyan-500/30 transition-all duration-700 pointer-events-none"></div>
               <div className="relative z-10">
                 <Activity size={40} className="text-cyan-600 dark:text-cyan-400 mb-6 md:mb-8" />
                 <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Real-Time Tracking</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-lg font-medium leading-relaxed">Watch your cash flow update instantly. Our fast engine ensures you never miss a detail in your financial journey.</p>
               </div>
               
               {/* Decorative Element */}
               <div className="absolute bottom-0 right-0 left-8 md:left-12 h-32 md:h-48 flex items-end gap-2 md:gap-3 opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  {[40, 70, 45, 90, 65, 100, 80, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-transparent rounded-t-lg md:rounded-t-2xl shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{height: `${h}%`}}></div>
                  ))}
               </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 hover:border-violet-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[300px] md:min-h-0 shadow-2xl">
               <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-violet-500/5 dark:bg-violet-500/20 blur-[80px] group-hover:bg-violet-500/10 dark:group-hover:bg-violet-500/40 transition-all duration-700 pointer-events-none"></div>
               <ShieldCheck size={32} className="text-violet-600 dark:text-violet-400 relative z-10" />
               <div className="relative z-10">
                 <h3 className="text-2xl md:text-3xl font-black mb-3 text-slate-900 dark:text-white">Bank-Level Security</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">Your data is encrypted with the highest security standards to keep your information safe.</p>
               </div>
            </div>

            {/* Small Card 2 */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 hover:border-fuchsia-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[300px] md:min-h-0 shadow-2xl">
               <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-fuchsia-500/5 dark:bg-fuchsia-500/20 blur-[80px] group-hover:bg-fuchsia-500/10 dark:group-hover:bg-fuchsia-500/40 transition-all duration-700 pointer-events-none"></div>
               <Globe size={32} className="text-fuchsia-600 dark:text-fuchsia-400 relative z-10" />
               <div className="relative z-10">
                 <h3 className="text-2xl md:text-3xl font-black mb-3 text-slate-900 dark:text-white">Access Anywhere</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">Access your dashboard from any device, anywhere in the world, seamlessly.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Massive CTA */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative z-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0a0a0a] to-[#111] backdrop-blur-2xl border border-white/10 rounded-[3rem] md:rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.15)] transition-all duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 dark:from-violet-600/20 via-transparent to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-8 md:space-y-12 flex flex-col items-center">
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
              START YOUR <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">JOURNEY.</span>
            </h2>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black py-4 md:py-6 px-10 md:px-16 rounded-full shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-2xl dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all text-xl md:text-2xl"
            >
              Get Started <ArrowUpRight size={24} />
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-16 border-t border-white/5 text-center relative z-10 bg-[#030303] backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
           <Zap className="text-cyan-600 dark:text-cyan-400" size={28} fill="currentColor" />
           <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">UBAK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">(UANG BIJAK)</span></span>
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.4em]">
          &copy; 2026 UBAK (UANG BIJAK) &bull; Excellence In Finance
        </p>
      </footer>

      {/* Custom Styles for Marquee & Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
