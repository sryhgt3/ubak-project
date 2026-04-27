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

        {/* Floating Navigation */}
        <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shrink-0">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">UBAK <span className="text-rose-500 underline underline-offset-4 decoration-rose-500/30">PRO</span></span>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl animate-in fade-in zoom-in-95 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 text-rose-300 text-[10px] font-bold tracking-widest uppercase mb-8">
            <TrendingUp size={14} />
            <span>Master Your Financial Future</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
            Success is a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300">Choice.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10 drop-shadow-md">
            Stop guessing. Start growing. Track your wealth, optimize every expense, and reach your savings milestones with the most elegant financial partner.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="group bg-white text-slate-900 font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:bg-slate-50 active:scale-95 flex items-center justify-center gap-2"
            >
              Access Your Wealth <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 hover:bg-white/20">
              Watch The Journey
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/30">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* Main Philosophy Section */}
      <section className="py-24 px-6 relative bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              The Path to <br/>
              <span className="text-rose-500">Wealth</span> is Clarity.
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We believe that financial success isn't about how much you earn, but how much you keep and how you grow it. UBAK Pro provides the clarity you need to make successful decisions every single day.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Target className="text-orange-500" />, title: "Precise Budgeting", desc: "Know where every penny goes." },
                { icon: <Zap className="text-amber-500" />, title: "Instant Insights", desc: "Real-time growth analytics." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Card Stack */}
          <div className="relative group">
             <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                       <BarChart3 size={20} />
                    </div>
                    <div>
                       <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Success Rate</h3>
                       <p className="text-[10px] text-slate-400">Growth Projection</p>
                    </div>
                  </div>
                  <span className="text-emerald-500 font-bold text-xl">+42%</span>
                </div>
                <div className="space-y-3">
                  {[80, 60, 95, 40].map((w, i) => (
                    <div key={i} className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 opacity-80" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Success Pillars */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Your Pillars of Success</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Three core principles that turn savings into lasting success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Wallet className="text-emerald-500" size={32} />, 
                title: "Financial Discipline", 
                desc: "Success starts with what you save. Automate your discipline and watch your capital grow effortlessly." 
              },
              { 
                icon: <Target className="text-rose-500" size={32} />, 
                title: "Strategic Goals", 
                desc: "Set, track, and conquer your dream milestones. Whether it's a new home or early retirement." 
              },
              { 
                icon: <TrendingUp className="text-blue-500" size={32} />, 
                title: "Compound Growth", 
                desc: "Every penny saved is a seed planted. Our visual analytics show you the future impact of today's choices." 
              },
            ].map((pillar, i) => (
              <div key={i} className="group bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:shadow-md transition-all duration-500 text-left space-y-6">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center transition-transform duration-500">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden bg-slate-900 dark:bg-slate-100 rounded-3xl p-12 md:p-20 text-center">
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-slate-900 tracking-tight leading-tight">
              Your Journey <br/>
              Starts Today.
            </h2>
            <p className="text-lg text-slate-400 dark:text-slate-500 max-w-xl mx-auto font-medium">
              Join thousands of successful users who have mastered their cash flow.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2.5 bg-rose-500 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95"
            >
              Start Free Trial <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-10 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <ShieldCheck className="text-rose-500" size={18} />
           <span className="text-base font-bold text-slate-900 dark:text-white">UBAK PRO</span>
        </div>
        <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2026 UBAK Pro &bull; Excellence In Finance
        </p>
      </footer>

      {/* Dark Mode Toggle - Bottom Right */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center active:scale-95 transition-all z-[10000] group"
      >
        {isDarkMode ? (
          <Sun size={20} className="transition-transform" />
        ) : (
          <Moon size={20} className="transition-transform" />
        )}
      </button>
    </div>
  );
};

export default LandingPage;
