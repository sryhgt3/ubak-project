import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateFinancialHealth } from '../utils/financialHealth';

interface FinancialHealthWidgetProps {
  totalIncome: number;
  totalExpense: number;
  formatCurrency: (amount: number) => string;
}

const FinancialHealthWidget: React.FC<FinancialHealthWidgetProps> = ({ totalIncome, totalExpense, formatCurrency }) => {
  const health = useMemo(() => calculateFinancialHealth(totalIncome, totalExpense), [totalIncome, totalExpense]);

  const progressValue = health.expenseRatio !== null ? Math.min(health.expenseRatio, 100) : 0;
  const isOverBudget = health.expenseRatio !== null && health.expenseRatio > 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/70 backdrop-blur-2xl dark:bg-[#0a0a0a] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/50 dark:border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[160px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all duration-500 hover:border-white/20 group`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-2xl rounded-full transition-colors pointer-events-none ${health.colorClass.split(' ')[1]}`}></div>
      
      <div className="flex items-start justify-between relative z-10 mb-4">
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Kesehatan Keuangan</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{health.emoji}</span>
            <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">{health.label}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 relative z-10 mb-5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Pemasukan</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(health.totalIncome)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Pengeluaran</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(health.totalExpense)}</span>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-slate-200/50 dark:border-white/10 pt-2">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{health.netBalance < 0 ? 'Defisit' : 'Sisa'}</span>
          <span className={`font-black ${health.netBalance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {health.netBalance < 0 ? '-' : ''}{formatCurrency(Math.abs(health.netBalance))}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="flex justify-between items-end mb-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengeluaran</p>
          {health.expenseRatio !== null && (
            <p className={`text-xs font-black ${isOverBudget ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {health.expenseRatio.toFixed(1)}%
            </p>
          )}
        </div>
        
        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          {health.expenseRatio !== null && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                health.status === 'HEALTHY' ? 'bg-emerald-500' : 
                health.status === 'ATTENTION' ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            />
          )}
        </div>
        {health.expenseRatio !== null && (
           <p className="text-[9px] text-slate-400 mt-2 text-center md:text-left">{health.expenseRatio.toFixed(1)}% pemasukan telah digunakan</p>
        )}
      </div>
    </motion.div>
  );
};

export default FinancialHealthWidget;
