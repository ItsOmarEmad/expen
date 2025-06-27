import { ChartData, PieData } from '../types';

export const generateIncomeVsSpendingData = (monthlyIncome: number, totalExpenses: number, monthlySavings: number): ChartData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    income: monthlyIncome + (Math.random() - 0.5) * 200,
    spending: totalExpenses + (Math.random() - 0.5) * 300,
    savings: monthlySavings + (Math.random() - 0.5) * 100
  }));
};

export const generateSavingsProjection = (currentMoney: number, monthlySavings: number, expectedIncrease: number): ChartData[] => {
  const months = [];
  let currentSavings = currentMoney;
  for (let i = 0; i < 12; i++) {
    currentSavings += monthlySavings + (expectedIncrease * (i / 12));
    months.push({
      month: `Month ${i + 1}`,
      savings: currentSavings,
      withInvestment: currentSavings * (1 + 0.07 * (i / 12)) // 7% annual return
    });
  }
  return months;
};

export const generatePieData = (expenses: Array<{ category: string; amount: number }>): PieData[] => {
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));
}; 