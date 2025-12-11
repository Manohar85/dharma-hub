import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
  state: string;
  language: string;
  deity: string;
  onboardingComplete: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  state: 'other',
  language: 'hindi',
  deity: 'other',
  onboardingComplete: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('bhakti-preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('bhakti-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setPreferences((prev) => ({ ...prev, onboardingComplete: true }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('bhakti-preferences');
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, updatePreferences, completeOnboarding, resetPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
