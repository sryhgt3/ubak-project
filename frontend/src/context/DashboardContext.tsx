import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Transaction {
  id: number;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
  description: string;
  date: string;
}

interface DashboardData {
  username: string;
  role: string;
  monthly_income: number;
  max_spending: number;
  savings_goal: string;
  dream_item: string;
  total_balance: number;
  total_income: number;
  total_expenses: number;
  recent_transactions: Transaction[];
  message: string;
  vip_perks?: string;
  free_status?: string;
}

interface TrendPoint {
  date: string;
  income: number;
  expense: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface DashboardContextType {
  data: DashboardData | null;
  trends: TrendPoint[] | null;
  categories: CategoryBreakdown[] | null;
  aiAdvice: string | null;
  isLoading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
  getAIAdvice: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [trends, setTrends] = useState<TrendPoint[] | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[] | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8800';
      
      const dashRes = await axios.get(`${apiUrl}/dashboard`, config);
      setData(dashRes.data);

      if (user?.role === 'VIP' || user?.role === 'Admin') {
        const [trendsRes, catsRes] = await Promise.all([
          axios.get(`${apiUrl}/analytics/trends`, config),
          axios.get(`${apiUrl}/analytics/categories`, config)
        ]);
        setTrends(trendsRes.data);
        setCategories(catsRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.role]);

  const getAIAdvice = async () => {
    if (!token || (user?.role !== 'VIP' && user?.role !== 'Admin')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8800';
      const res = await axios.get(`${apiUrl}/ai/advice`, config);
      setAiAdvice(res.data.response);
    } catch (err) {
      setAiAdvice("Maaf, gagal mendapatkan saran AI saat ini.");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <DashboardContext.Provider value={{ 
      data, 
      trends, 
      categories, 
      aiAdvice, 
      isLoading, 
      error, 
      refreshDashboard: fetchDashboard,
      getAIAdvice
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
