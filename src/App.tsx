import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Goals from './components/Goals';
import Investment from './components/Investment';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated } = useAuth();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'goals':
        return <Goals />;
      case 'invest':
        return <Investment />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <Login onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="animate-fade-in-up">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <FinancialProvider>
            <AppContent />
          </FinancialProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 