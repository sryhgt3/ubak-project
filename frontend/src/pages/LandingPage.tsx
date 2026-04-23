import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  Sun, 
  Moon, 
  Wallet, 
  Zap, 
  BarChart3,
  ChevronDown
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetTheme, setTargetTheme] = useState<'light' | 'dark' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = (event: React.MouseEvent) => {
    if (isAnimating) return;

    const x = event.clientX;
    const y = event.clientY;
    const nextIsDark = !isDarkMode;

    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    setTargetTheme(nextIsDark ? 'dark' : 'light');
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsDarkMode(nextIsDark);
    }, 400);

    setTimeout(() => {
      setIsAnimating(false);
      setTargetTheme(null);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-rose-500/30 selection:text-rose-900 overflow-x-hidden">
      {/* Animation Overlay */}
      {isAnimating && (
        <div 
          className={`theme-transition-overlay animate-reveal ${targetTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}
        />
      )}

      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80 z-10" />
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 blur-[2px]"
          >
            {/* Using a high-quality abstract finance/city background video from Pexels */}
            <source src="https://cdn.pixabay.com/video/2021/09/03/87403-601466718_large.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Floating Navigation / Toggle */}
        <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">UBAK <span className="text-rose-500 underline decoration-rose-500/30">PRO</span></span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all group"
          >
            {isDarkMode ? (
              <Sun size={20} className="group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl animate-in fade-in zoom-in-95 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 text-rose-300 text-[10px] font-black tracking-[0.25em] uppercase mb-8 shadow-2xl">
            <TrendingUp size={14} />
            <span>Master Your Financial Future</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-8">
            Success is a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300">Choice.</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-12 drop-shadow-lg">
            Stop guessing. Start growing. Track your wealth, optimize every expense, and reach your savings milestones with the most elegant financial partner.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/login" 
              className="group bg-white text-slate-900 font-black py-5 px-12 rounded-2xl transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Access Your Wealth <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:border-white/40">
              Watch The Journey
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/40">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Main Philosophy Section */}
      <section className="py-32 px-6 relative bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              The Path to <br/>
              <span className="text-rose-500">Wealth</span> is Clarity.
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We believe that financial success isn't about how much you earn, but how much you keep and how you grow it. UBAK Pro provides the clarity you need to make successful decisions every single day.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Target className="text-orange-500" />, title: "Precise Budgeting", desc: "Know where every penny goes." },
                { icon: <Zap className="text-amber-500" />, title: "Instant Insights", desc: "Real-time growth analytics." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Card Stack */}
          <div className="relative group">
             <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 to-orange-500 rounded-[3rem] blur-2xl opacity-10 dark:opacity-20 group-hover:opacity-30 transition-opacity" />
             <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
                       <BarChart3 size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900 dark:text-white">Success Rate</h3>
                       <p className="text-xs text-slate-400">Growth Projection</p>
                    </div>
                  </div>
                  <span className="text-emerald-500 font-black text-2xl">+42%</span>
                </div>
                <div className="space-y-4">
                  {[80, 60, 95, 40].map((w, i) => (
                    <div key={i} className="w-full bg-slate-50 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-1000 group-hover:opacity-100 opacity-60" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Success Pillars */}
      <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Your Pillars of Success</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Three core principles that turn savings into lasting success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: <Wallet className="text-emerald-500" size={40} />, 
                title: "Financial Discipline", 
                desc: "Success starts with what you save. Automate your discipline and watch your capital grow effortlessly." 
              },
              { 
                icon: <Target className="text-rose-500" size={40} />, 
                title: "Strategic Goals", 
                desc: "Set, track, and conquer your dream milestones. Whether it's a new home or early retirement." 
              },
              { 
                icon: <TrendingUp className="text-blue-500" size={40} />, 
                title: "Compound Growth", 
                desc: "Every penny saved is a seed planted. Our visual analytics show you the future impact of today's choices." 
              },
            ].map((pillar, i) => (
              <div key={i} className="group bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-4 text-left space-y-6">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto relative overflow-hidden bg-slate-900 dark:bg-white rounded-[4rem] p-12 md:p-24 text-center">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-7xl font-black text-white dark:text-slate-900 tracking-tighter leading-none">
              Your Journey <br/>
              Starts Today.
            </h2>
            <p className="text-xl text-slate-400 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Join thousands of successful users who have mastered their cash flow.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-3 bg-rose-500 text-white font-black py-6 px-16 rounded-[2rem] shadow-2xl shadow-rose-500/40 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95"
            >
              Start Free Trial <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
           <ShieldCheck className="text-rose-500" size={20} />
           <span className="text-lg font-black text-slate-900 dark:text-white">UBAK PRO</span>
        </div>
        <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
          &copy; 2026 UBAK Pro &bull; Excellence In Finance
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
