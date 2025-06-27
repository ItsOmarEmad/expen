import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter, Search, Calendar, DollarSign, Tag, ArrowUpDown } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const Expenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense, updateExpense } = useFinancial();
  const { isDarkMode } = useTheme();
  const { cardColors } = useSettings();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense, {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date)
      });
      setEditingExpense(null);
    } else {
      addExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date)
      });
    }
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.toISOString().split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const filteredAndSortedExpenses = expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || expense.category === filterCategory)
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses
    .filter(expense => {
      const now = new Date();
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = categories.reduce((acc, category) => {
    acc[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Expense Tracker
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage and track your spending
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="modern-button flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 animate-pulse"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Expenses
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This Month
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${monthlyExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Tag className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Categories
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
        isDarkMode ? 'glass-dark' : 'glass'
      } animate-slide-in-right`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-4 py-3 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
            className={`px-4 py-3 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <ArrowUpDown size={20} />
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-scale-in`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
              <input
                type="number"
                placeholder="Amount"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingExpense(null);
                  setFormData({
                    description: '',
                    amount: '',
                    category: 'Food',
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

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredAndSortedExpenses.map((expense, index) => (
          <div
            key={expense.id}
            className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
              isDarkMode ? 'glass-dark' : 'glass'
            } animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  expense.category === 'Food' ? 'bg-red-500/10' :
                  expense.category === 'Transport' ? 'bg-blue-500/10' :
                  expense.category === 'Entertainment' ? 'bg-purple-500/10' :
                  expense.category === 'Shopping' ? 'bg-pink-500/10' :
                  expense.category === 'Bills' ? 'bg-orange-500/10' :
                  expense.category === 'Healthcare' ? 'bg-green-500/10' :
                  expense.category === 'Education' ? 'bg-indigo-500/10' :
                  'bg-gray-500/10'
                }`}>
                  <Tag className={`w-5 h-5 ${
                    expense.category === 'Food' ? 'text-red-500' :
                    expense.category === 'Transport' ? 'text-blue-500' :
                    expense.category === 'Entertainment' ? 'text-purple-500' :
                    expense.category === 'Shopping' ? 'text-pink-500' :
                    expense.category === 'Bills' ? 'text-orange-500' :
                    expense.category === 'Healthcare' ? 'text-green-500' :
                    expense.category === 'Education' ? 'text-indigo-500' :
                    'text-gray-500'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {expense.description}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {expense.category}
                    </span>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {expense.date.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
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

      {filteredAndSortedExpenses.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-lg">No expenses found</p>
          <p className="text-sm">Add your first expense to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Expenses; 