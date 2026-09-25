export type FinancialHealthStatus = "HEALTHY" | "ATTENTION" | "DEFICIT" | "NO_DATA" | "NO_INCOME";

export type FinancialHealth = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  expenseRatio: number | null;
  status: FinancialHealthStatus;
  emoji: string;
  label: string;
  colorClass: string;
};

export const calculateFinancialHealth = (totalIncome: number, totalExpense: number): FinancialHealth => {
  const netBalance = totalIncome - totalExpense;

  if (totalIncome === 0 && totalExpense === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      expenseRatio: null,
      status: "NO_DATA",
      emoji: "⚪",
      label: "Belum ada data",
      colorClass: "text-slate-400 bg-slate-100 dark:bg-white/5",
    };
  }

  if (totalIncome === 0 && totalExpense > 0) {
    return {
      totalIncome: 0,
      totalExpense,
      netBalance,
      expenseRatio: null,
      status: "NO_INCOME",
      emoji: "🟠",
      label: "Tidak ada pemasukan",
      colorClass: "text-orange-500 bg-orange-500/10",
    };
  }

  const expenseRatio = (totalExpense / totalIncome) * 100;

  if (totalExpense > totalIncome) {
    return {
      totalIncome,
      totalExpense,
      netBalance,
      expenseRatio,
      status: "DEFICIT",
      emoji: "🔴",
      label: "Defisit",
      colorClass: "text-rose-500 bg-rose-500/10",
    };
  }

  if (expenseRatio > 70) {
    return {
      totalIncome,
      totalExpense,
      netBalance,
      expenseRatio,
      status: "ATTENTION",
      emoji: "🟡",
      label: "Perlu Perhatian",
      colorClass: "text-amber-500 bg-amber-500/10",
    };
  }

  return {
    totalIncome,
    totalExpense,
    netBalance,
    expenseRatio,
    status: "HEALTHY",
    emoji: "🟢",
    label: "Keuangan Sehat",
    colorClass: "text-emerald-500 bg-emerald-500/10",
  };
};
