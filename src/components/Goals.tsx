import React, { useState } from 'react';
import { Plus, Target, Calendar, DollarSign, TrendingUp, Edit, Trash2, CheckCircle, Circle, Star, Zap } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const Goals: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoal } = useFinancial();
  const { isDarkMode } = useTheme();
  const { cardColors } = useSettings();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: 'Savings',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const categories = ['Savings', 'Investment', 'Emergency Fund', 'Vacation', 'Home', 'Car', 'Education', 'Other'];
  const priorities = [
    { value: 'low' as const, label: 'Low', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { value: 'medium' as const, label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { value: 'high' as const, label: 'High', color: 'text-red-500', bgColor: 'bg-red-500/10' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      updateGoal(editingGoal, {
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: new Date(formData.targetDate),
        category: formData.category,
        priority: formData.priority
      });
      setEditingGoal(null);
    } else {
      addGoal({
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: new Date(formData.targetDate),
        category: formData.category,
        priority: formData.priority,
        completed: false
      });
    }
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: '',
      category: 'Savings',
      priority: 'medium' as 'low' | 'medium' | 'high'
    });
    setShowAddForm(false);
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal.id);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate.toISOString().split('T')[0],
      category: goal.category,
      priority: goal.priority
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleToggleComplete = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      updateGoal(id, { ...goal, completed: !goal.completed });
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'active') return !goal.completed;
    if (filterStatus === 'completed') return goal.completed;
    return true;
  });

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const activeGoals = totalGoals - completedGoals;
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-4 h-4 text-red-500" />;
      case 'medium': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Circle className="w-4 h-4 text-green-500" />;
      default: return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Financial Goals
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Set, track, and achieve your financial milestones
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="modern-button flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 animate-pulse"
        >
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Goals
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {totalGoals}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Completed
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {completedGoals}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Goals
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeGoals}
              </p>
            </div>
          </div>
        </div>

        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-slide-in-left`} style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Overall Progress
              </p>
              <p className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>
                {overallProgress.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
        isDarkMode ? 'glass-dark' : 'glass'
      } animate-slide-in-right`}>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Overall Progress
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Progress: ${totalCurrentAmount.toLocaleString()} / ${totalTargetAmount.toLocaleString()}
            </span>
            <span className={`font-bold ${getProgressColor(overallProgress)}`}>
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                overallProgress >= 80 ? 'bg-green-500' :
                overallProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
        isDarkMode ? 'glass-dark' : 'glass'
      } animate-scale-in`}>
        <div className="flex flex-wrap gap-4">
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as 'all' | 'active' | 'completed')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'glass-dark' : 'glass'
        } animate-scale-in`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Goal Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
              <input
                type="number"
                placeholder="Target Amount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
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
              <input
                type="number"
                placeholder="Current Amount"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                step="0.01"
                min="0"
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
                className={`px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
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
            </div>
            <div className="flex gap-4">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    formData.priority === priority.value
                      ? `${priority.bgColor} ${priority.color}`
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getPriorityIcon(priority.value)}
                  {priority.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="modern-button flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                  setFormData({
                    title: '',
                    targetAmount: '',
                    currentAmount: '0',
                    targetDate: '',
                    category: 'Savings',
                    priority: 'medium' as 'low' | 'medium' | 'high'
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

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const priority = priorities.find(p => p.value === goal.priority);

          return (
            <div
              key={goal.id}
              className={`interactive-card p-6 rounded-2xl transition-all duration-300 ${
                isDarkMode ? 'glass-dark' : 'glass'
              } ${goal.completed ? 'opacity-75' : ''} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleComplete(goal.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {goal.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${
                        goal.completed ? 'line-through' : ''
                      }`}>
                        {goal.title}
                      </h4>
                      {getPriorityIcon(goal.priority)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.category === 'Savings' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        goal.category === 'Investment' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        goal.category === 'Emergency Fund' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        goal.category === 'Vacation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        goal.category === 'Home' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        goal.category === 'Car' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                        goal.category === 'Education' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {goal.targetDate.toLocaleDateString()}
                      </span>
                      <span className={`${daysRemaining > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Progress
                  </span>
                  <span className={`text-sm font-bold ${getProgressColor(progress)}`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progress >= 80 ? 'bg-green-500' :
                      progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-lg">No goals found</p>
          <p className="text-sm">Add your first financial goal to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Goals; 