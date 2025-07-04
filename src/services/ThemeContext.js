import React, {createContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'dark');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
