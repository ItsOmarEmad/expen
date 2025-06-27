import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, PiggyBank, Target, Heart, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Zap, Star } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { generateIncomeVsSpendingData, generateSavingsProjection, generatePieData } from '../utils/chartData';
import { getDonationRecommendation } from '../utils/aiUtils';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

const Dashboard: React.FC = () => {
  const { 
    currentMoney, 
    monthlyIncome, 
    monthlySavings, 
    savingsRate, 
    expenses,
    expectedIncrease 
  } = useFinancial();
  
  const { isDarkMode } = useTheme();
  const { cardColors } = useSettings();
  const [showBalance, setShowBalance] = useState(true);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const incomeVsSpendingData = generateIncomeVsSpendingData(monthlyIncome, expenses.reduce((sum, exp) => sum + exp.amount, 0), monthlySavings);
  const savingsProjectionData = generateSavingsProjection(currentMoney, monthlySavings, expectedIncrease);
  const pieData = generatePieData(expenses);
  const donationRecommendation = getDonationRecommendation(monthlySavings);

  const metrics = [
    {
      id: 'balance',
      label: 'Current Balance',
      value: currentMoney,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      id: 'income',
      label: 'Monthly Income',
      value: monthlyIncome,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      id: 'savings',
      label: 'Monthly Savings',
      value: monthlySavings,
      icon: PiggyBank,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      id: 'rate',
      label: 'Savings Rate',
      value: savingsRate,
      icon: Target,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: '+5.7%',
      changeType: 'positive',
      suffix: '%'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome back! 👋
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Here's your financial overview for today
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
              isDarkMode ? 'glass-dark' : 'glass'
            } ${activeMetric === metric.id ? 'animate-glow' : ''}`}
            onMouseEnter={() => setActiveMetric(metric.id)}
            onMouseLeave={() => setActiveMetric(null)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="flex items-center gap-1">
                {metric.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </p>
              <div className="flex items-center gap-2">
                {metric.id === 'balance' && (
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.id === 'balance' && !showBalance ? '••••••' : 
                   metric.id === 'rate' ? `${metric.value.toFixed(1)}${metric.suffix}` :
                   `$${metric.value.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Spending Chart */}
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Income vs Spending
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Income</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Spending</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incomeVsSpendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  borderRadius: '12px'
                }}
              />
              <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="spending" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category */}
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-right`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  borderRadius: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Projection */}
      <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
        isDarkMode ? 'glass-dark' : 'glass'
      } animate-scale-in`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Savings Growth Projection
          </h3>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Next 12 Months
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={savingsProjectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                color: isDarkMode ? '#ffffff' : '#000000',
                borderRadius: '12px'
              }}
            />
            <Line type="monotone" dataKey="savings" stroke="#8b5cf6" strokeWidth={3} name="Savings Only" />
            <Line type="monotone" dataKey="withInvestment" stroke="#f59e0b" strokeWidth={3} name="With Investment" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-fade-in-up`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button className="modern-button w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              Add New Expense
            </button>
            <button className="modern-button w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
              Set New Goal
            </button>
            <button className="modern-button w-full p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300">
              View Reports
            </button>
          </div>
        </div>

        {/* Smart Insights */}
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-fade-in-up`}>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Smart Insights
            </h3>
          </div>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Donation Recommendation
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Consider donating <span className="font-semibold text-red-600">${donationRecommendation.amount.toFixed(0)}</span> this month
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Savings Trend
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your savings rate is <span className="font-semibold text-green-600">{savingsRate > 20 ? 'excellent' : 'good'}</span> this month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 