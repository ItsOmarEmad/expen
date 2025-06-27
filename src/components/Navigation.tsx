import React, { useState } from 'react';
import { DollarSign, Trash2, Target, TrendingUp, Moon, Sun, User, LogOut, Palette, ChevronDown, LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface TabButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  activeTab: string;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, activeTab, onClick }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <button
      onClick={() => onClick(id)}
      className={`interactive-card flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${
        activeTab === id 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
          : isDarkMode 
            ? 'glass-dark text-gray-300 hover:text-white hover:scale-105' 
            : 'glass text-gray-700 hover:text-gray-900 hover:scale-105'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
};

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cardColors, updateCardColors, resetCardColors } = useSettings();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: Trash2 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'invest', label: 'Invest', icon: TrendingUp }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleColorChange = (key: keyof typeof cardColors, value: string) => {
    updateCardColors({ ...cardColors, [key]: value });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between">
      {/* Main Navigation Tabs */}
      <nav className="flex flex-wrap gap-4 justify-center animate-fade-in-up">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-slide-in-up"
          >
            <TabButton
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          </div>
        ))}
      </nav>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Color Customization */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`interactive-card flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
              isDarkMode ? 'glass-dark text-gray-300 hover:text-white' : 'glass text-gray-700 hover:text-gray-900'
            }`}
          >
            <Palette size={20} />
            <span className="hidden sm:inline">Colors</span>
          </button>
          
          {showColorPicker && (
            <div className={`absolute right-0 top-full mt-2 p-4 rounded-xl shadow-lg z-50 ${
              isDarkMode ? 'glass-dark' : 'glass'
            } animate-scale-in`}>
              <div className="space-y-3 min-w-[200px]">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={cardColors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cardColors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className={`flex-1 px-2 py-1 text-xs rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Primary
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={cardColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cardColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className={`flex-1 px-2 py-1 text-xs rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Secondary
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={cardColors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={cardColors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className={`flex-1 px-2 py-1 text-xs rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <button
                  onClick={resetCardColors}
                  className="w-full px-3 py-2 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset Colors
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`interactive-card flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
            isDarkMode ? 'glass-dark text-gray-300 hover:text-white' : 'glass text-gray-700 hover:text-gray-900'
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`interactive-card flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
              isDarkMode ? 'glass-dark text-gray-300 hover:text-white' : 'glass text-gray-700 hover:text-gray-900'
            }`}
          >
            <User size={20} />
            <span className="hidden sm:inline">{user?.name}</span>
            <ChevronDown size={16} />
          </button>
          
          {showUserMenu && (
            <div className={`absolute right-0 top-full mt-2 p-4 rounded-xl shadow-lg z-50 ${
              isDarkMode ? 'glass-dark' : 'glass'
            } animate-scale-in min-w-[200px]`}>
              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showColorPicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowColorPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default Navigation; 