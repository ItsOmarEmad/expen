import { InvestmentRecommendation, DonationRecommendation } from '../types';

export const getAIResponse = (question: string, currentMoney: number, monthlyIncome: number, monthlySavings: number, expensesByCategory: Record<string, number>): string => {
  const responses = {
    'can i afford': `Based on your current savings of $${currentMoney} and monthly surplus of $${monthlySavings}, I'd recommend ensuring any purchase doesn't exceed 10% of your monthly surplus to maintain healthy finances.`,
    'phone': `For a new phone, consider your monthly surplus of $${monthlySavings}. If it's under $${(monthlySavings * 0.3).toFixed(0)}, it should be manageable without affecting your savings goals.`,
    'invest': `With $${monthlySavings} monthly surplus, I recommend investing 60% in index funds, 20% in bonds, and 20% in a high-yield savings account for emergency funds.`,
    'save': `Based on your income of $${monthlyIncome}, aim to save at least 20% ($${(monthlyIncome * 0.2).toFixed(0)}) monthly. You're currently saving $${monthlySavings}.`,
    'budget': `Your spending breakdown shows ${Object.entries(expensesByCategory).map(([cat, amt]) => `${cat}: $${amt}`).join(', ')}. Consider reducing discretionary spending if possible.`
  };

  const lowerQuestion = question.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerQuestion.includes(key)) {
      return response;
    }
  }
  return `Based on your financial profile: $${currentMoney} current savings, $${monthlyIncome} monthly income, and $${monthlySavings} monthly surplus, I can help you make informed decisions. What specific aspect would you like advice on?`;
};

export const getInvestmentRecommendations = (monthlySavings: number): InvestmentRecommendation[] => {
  const recommendations: InvestmentRecommendation[] = [];
  
  if (monthlySavings > 1000) {
    recommendations.push({ type: 'Stock Index Funds', allocation: '40%', reason: 'Long-term growth potential' });
    recommendations.push({ type: 'Bonds', allocation: '20%', reason: 'Stability and income' });
    recommendations.push({ type: 'Real Estate Investment', allocation: '20%', reason: 'Diversification' });
    recommendations.push({ type: 'Emergency Fund', allocation: '20%', reason: 'Liquidity for unexpected expenses' });
  } else if (monthlySavings > 500) {
    recommendations.push({ type: 'High-Yield Savings', allocation: '50%', reason: 'Build emergency fund first' });
    recommendations.push({ type: 'Index Funds', allocation: '30%', reason: 'Start building wealth' });
    recommendations.push({ type: 'Gold/Precious Metals', allocation: '20%', reason: 'Hedge against inflation' });
  } else {
    recommendations.push({ type: 'High-Yield Savings', allocation: '80%', reason: 'Focus on emergency fund' });
    recommendations.push({ type: 'Low-Cost Index Fund', allocation: '20%', reason: 'Begin investing habit' });
  }
  
  return recommendations;
};

export const getDonationRecommendation = (monthlySavings: number): DonationRecommendation => {
  const recommendedDonation = Math.max(10, monthlySavings * 0.05);
  return {
    amount: recommendedDonation,
    impact: `$${recommendedDonation}/month could provide 20 meals for families in need or support a child's education for 2 weeks.`
  };
}; 