export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: Date;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  type: string;
  expectedReturn: number;
  date: Date;
}

export interface Alert {
  type: 'warning' | 'danger';
  message: string;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
}

export interface InvestmentRecommendation {
  type: string;
  allocation: string;
  reason: string;
}

export interface DonationRecommendation {
  amount: number;
  impact: string;
}

export interface ChartData {
  month: string;
  income?: number;
  spending?: number;
  savings?: number;
  withInvestment?: number;
}

export interface PieData {
  name: string;
  value: number;
} 