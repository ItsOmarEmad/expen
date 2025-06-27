import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3, Plus, Edit, Trash2, Target, Zap, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

const Investment: React.FC = () => {
  const { investments, addInvestment, deleteInvestment, updateInvestment, expectedIncrease } = useFinancial();
  const { isDarkMode } = useTheme();
  const { cardColors } = useSettings();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'Stocks',
    expectedReturn: '8',
    date: new Date().toISOString().split('T')[0]
  });

  const investmentTypes = ['Stocks', 'Bonds', 'Real Estate', 'Crypto', 'ETF', 'Mutual Fund', 'Gold', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvestment) {
      updateInvestment(editingInvestment, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        type: formData.type,
        expectedReturn: parseFloat(formData.expectedReturn),
        date: new Date(formData.date)
      });
      setEditingInvestment(null);
    } else {
      addInvestment({
        name: formData.name,
        amount: parseFloat(formData.amount),
        type: formData.type,
        expectedReturn: parseFloat(formData.expectedReturn),
        date: new Date(formData.date)
      });
    }
    setFormData({
      name: '',
      amount: '',
      type: 'Stocks',
      expectedReturn: '8',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleEdit = (investment: any) => {
    setEditingInvestment(investment.id);
    setFormData({
      name: investment.name,
      amount: investment.amount.toString(),
      type: investment.type,
      expectedReturn: investment.expectedReturn.toString(),
      date: investment.date.toISOString().split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      deleteInvestment(id);
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpectedReturn = investments.reduce((sum, inv) => sum + (inv.amount * inv.expectedReturn / 100), 0);
  const averageReturn = investments.length > 0 ? totalExpectedReturn / totalInvested * 100 : 0;

  // Generate sample data for charts
  const generatePortfolioData = () => {
    const typeTotals = investmentTypes.reduce((acc, type) => {
      acc[type] = investments
        .filter(inv => inv.type === type)
        .reduce((sum, inv) => sum + inv.amount, 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([type, amount]) => ({ name: type, value: amount }));
  };

  const generatePerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      portfolio: totalInvested + (totalExpectedReturn * (index + 1) / 6),
      benchmark: totalInvested + (totalInvested * 0.06 * (index + 1) / 6)
    }));
  };

  const portfolioData = generatePortfolioData();
  const performanceData = generatePerformanceData();

  const getTypeColor = (type: string) => {
    const colors = {
      'Stocks': 'text-blue-500',
      'Bonds': 'text-green-500',
      'Real Estate': 'text-purple-500',
      'Crypto': 'text-orange-500',
      'ETF': 'text-pink-500',
      'Mutual Fund': 'text-indigo-500',
      'Gold': 'text-yellow-500',
      'Other': 'text-gray-500'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500';
  };

  const getTypeBgColor = (type: string) => {
    const colors = {
      'Stocks': 'bg-blue-500/10',
      'Bonds': 'bg-green-500/10',
      'Real Estate': 'bg-purple-500/10',
      'Crypto': 'bg-orange-500/10',
      'ETF': 'bg-pink-500/10',
      'Mutual Fund': 'bg-indigo-500/10',
      'Gold': 'bg-yellow-500/10',
      'Other': 'bg-gray-500/10'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Investment Portfolio
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track and manage your investment portfolio
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'chart'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <PieChartIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="modern-button flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 animate-pulse"
          >
            <Plus size={20} />
            Add Investment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Invested
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${totalInvested.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Expected Return
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${totalExpectedReturn.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg. Return Rate
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {averageReturn.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {viewMode === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Allocation */}
          <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
            isDarkMode ? 'glass-dark' : 'glass'
          } animate-slide-in-left`}>
            <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Portfolio Allocation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
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

          {/* Performance vs Benchmark */}
          <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
            isDarkMode ? 'glass-dark' : 'glass'
          } animate-slide-in-right`}>
            <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance vs Benchmark
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={3} name="Your Portfolio" />
                <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeWidth={3} name="Benchmark (6%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-scale-in`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Investment Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
              <input
                type="number"
                placeholder="Amount Invested"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                step="0.01"
                min="0"
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              >
                {investmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Expected Return (%)"
                value={formData.expectedReturn}
                onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                required
                step="0.1"
                min="0"
                max="100"
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="modern-button flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                {editingInvestment ? 'Update Investment' : 'Add Investment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingInvestment(null);
                  setFormData({
                    name: '',
                    amount: '',
                    type: 'Stocks',
                    expectedReturn: '8',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Investments List */}
      <div className="space-y-4">
        {investments.map((investment, index) => (
          <div
            key={investment.id}
            className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
              isDarkMode ? 'glass-dark' : 'glass'
            } animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${getTypeBgColor(investment.type)}`}>
                  <TrendingUp className={`w-5 h-5 ${getTypeColor(investment.type)}`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {investment.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {investment.type}
                    </span>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {investment.date.toLocaleDateString()}
                    </span>
                    <span className="text-green-500 font-medium">
                      {investment.expectedReturn}% return
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${investment.amount.toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Expected: ${(investment.amount * investment.expectedReturn / 100).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(investment)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(investment.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {investments.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-lg">No investments found</p>
          <p className="text-sm">Add your first investment to start building your portfolio!</p>
        </div>
      )}
    </div>
  );
};

export default Investment; 