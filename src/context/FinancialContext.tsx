import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, Goal, Investment, Alert, ChatMessage } from '../types';

interface FinancialContextType {
  currentMoney: number;
  setCurrentMoney: (value: number) => void;
  monthlyIncome: number;
  setMonthlyIncome: (value: number) => void;
  expectedIncrease: number;
  setExpectedIncrease: (value: number) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  investments: Investment[];
  setInvestments: (investments: Investment[]) => void;
  alerts: Alert[];
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Omit<Investment, 'id'>) => void;
  deleteInvestment: (id: string) => void;
  totalExpenses: number;
  monthlySavings: number;
  savingsRate: number;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children }) => {
  const [currentMoney, setCurrentMoney] = useState(5000);
  const [monthlyIncome, setMonthlyIncome] = useState(4000);
  const [expectedIncrease, setExpectedIncrease] = useState(500);
  const [expenses, setExpenses] = useState<Expense[]>([
    { 
      id: '1', 
      description: 'Rent Payment',
      category: 'Housing', 
      amount: 1200, 
      date: new Date('2025-06-01') 
    },
    { 
      id: '2', 
      description: 'Grocery Shopping',
      category: 'Food', 
      amount: 400, 
      date: new Date('2025-06-05') 
    },
    { 
      id: '3', 
      description: 'Gas Station',
      category: 'Transportation', 
      amount: 300, 
      date: new Date('2025-06-10') 
    },
    { 
      id: '4', 
      description: 'Electric Bill',
      category: 'Utilities', 
      amount: 150, 
      date: new Date('2025-06-15') 
    },
    { 
      id: '5', 
      description: 'Movie Tickets',
      category: 'Entertainment', 
      amount: 200, 
      date: new Date('2025-06-20') 
    }
  ]);
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1', 
      title: 'Emergency Fund',
      targetAmount: 10000, 
      currentAmount: 3000, 
      targetDate: new Date('2025-12-31'),
      category: 'Savings',
      priority: 'high',
      completed: false
    },
    { 
      id: '2', 
      title: 'Vacation Fund',
      targetAmount: 3000, 
      currentAmount: 500, 
      targetDate: new Date('2025-08-31'),
      category: 'Vacation',
      priority: 'medium',
      completed: false
    }
  ]);
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Apple Stock',
      amount: 2000,
      type: 'Stocks',
      expectedReturn: 8,
      date: new Date('2025-01-15')
    },
    {
      id: '2',
      name: 'S&P 500 ETF',
      amount: 1500,
      type: 'ETF',
      expectedReturn: 7,
      date: new Date('2025-02-01')
    }
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlySavings = monthlyIncome - totalExpenses;
  const savingsRate = (monthlySavings / monthlyIncome) * 100;

  // Generate alerts
  useEffect(() => {
    const newAlerts: Alert[] = [];
    if (savingsRate < 20) {
      newAlerts.push({
        type: 'warning',
        message: `You're only saving ${savingsRate.toFixed(1)}% of your income. Consider reducing expenses.`
      });
    }
    if (totalExpenses > monthlyIncome * 0.8) {
      newAlerts.push({
        type: 'danger',
        message: `You've spent ${((totalExpenses/monthlyIncome)*100).toFixed(1)}% of your income. Be careful!`
      });
    }
    setAlerts(newAlerts);
  }, [expenses, monthlyIncome, savingsRate, totalExpenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...expense, id } : exp));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
  };

  const updateGoal = (id: string, goal: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    setInvestments(prev => [...prev, { ...investment, id: Date.now().toString() }]);
  };

  const updateInvestment = (id: string, investment: Omit<Investment, 'id'>) => {
    setInvestments(prev => prev.map(inv => inv.id === id ? { ...investment, id } : inv));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const value: FinancialContextType = {
    currentMoney,
    setCurrentMoney,
    monthlyIncome,
    setMonthlyIncome,
    expectedIncrease,
    setExpectedIncrease,
    expenses,
    setExpenses,
    goals,
    setGoals,
    investments,
    setInvestments,
    alerts,
    chatHistory,
    setChatHistory,
    addExpense,
    updateExpense,
    deleteExpense,
    addGoal,
    updateGoal,
    deleteGoal,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    totalExpenses,
    monthlySavings,
    savingsRate
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
}; 