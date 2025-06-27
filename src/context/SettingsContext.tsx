import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CardColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface SettingsContextType {
  cardColors: CardColors;
  updateCardColors: (colors: Partial<CardColors>) => void;
  resetCardColors: () => void;
}

const defaultColors: CardColors = {
  primary: '#1f2937',
  secondary: '#374151',
  accent: '#3b82f6',
  background: '#ffffff'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [cardColors, setCardColors] = useState<CardColors>(() => {
    const saved = localStorage.getItem('cardColors');
    return saved ? JSON.parse(saved) : defaultColors;
  });

  useEffect(() => {
    localStorage.setItem('cardColors', JSON.stringify(cardColors));
  }, [cardColors]);

  const updateCardColors = (colors: Partial<CardColors>) => {
    setCardColors(prev => ({ ...prev, ...colors }));
  };

  const resetCardColors = () => {
    setCardColors(defaultColors);
  };

  return (
    <SettingsContext.Provider value={{ cardColors, updateCardColors, resetCardColors }}>
      {children}
    </SettingsContext.Provider>
  );
}; 