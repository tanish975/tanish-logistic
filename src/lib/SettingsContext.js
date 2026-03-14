import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({
  siteName: 'Tanish Logistic',
  logoUrl: '/icon.png',
  slogan: '',
  contactDetails: '',
  copyright: '',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  isLoading: true,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Tanish Logistic',
    logoUrl: '/icon.png',
    slogan: '',
    contactDetails: '',
    copyright: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    paymentApiKey: '',
    defaultPostStatus: 'draft',
    commentModeration: 'manual',
    passwordPolicy: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/general');
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, isLoading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
