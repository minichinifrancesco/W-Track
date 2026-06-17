import React, { createContext, useContext, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  getUserSettings,
  saveUserSettings,
} from '../services/api';

const DEFAULT_SETTINGS = {
  weightUnit: 'kg',      // 'kg' | 'lbs'
  themeMode: 'auto',     // 'light' | 'dark' | 'auto'
  defaultRestTime: 60,   // seconds
  showExerciseNotes: true,
  restTimerHaptic: false,
  restTimerSound: false,
};

export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  loadSettings: async () => {},
  clearSettings: () => {},
  convertWeight: (v) => v,
  formatWeight: (v) => `${v} kg`,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const authTokenRef = useRef(null);

  const loadSettings = async (token) => {
    authTokenRef.current = token || null;
    if (!token) {
      setSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }

    const serverSettings = await getUserSettings(token);
    const nextSettings = { ...DEFAULT_SETTINGS, ...serverSettings };
    setSettings(nextSettings);
    return nextSettings;
  };

  const clearSettings = () => {
    authTokenRef.current = null;
    setSettings(DEFAULT_SETTINGS);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      if (authTokenRef.current) {
        saveUserSettings(authTokenRef.current, next)
          .then((serverSettings) => {
            setSettings((current) => ({
              ...current,
              ...serverSettings,
            }));
          })
          .catch((error) => {
            console.error('Errore salvataggio impostazioni:', error.message || error);
          });
      }
      return next;
    });
  };

  // Convert a weight value FROM kg TO display unit
  const convertWeight = (kgValue) => {
    if (settings.weightUnit === 'lbs') {
      return Math.round(parseFloat(kgValue || 0) * 2.20462 * 10) / 10;
    }
    return parseFloat(kgValue || 0);
  };

  // Convert a weight value FROM display unit TO kg (for storage)
  const toKg = (displayValue) => {
    if (settings.weightUnit === 'lbs') {
      return Math.round((parseFloat(displayValue || 0) / 2.20462) * 10) / 10;
    }
    return parseFloat(displayValue || 0);
  };

  const formatWeight = (kgValue) => {
    const converted = convertWeight(kgValue);
    return `${converted} ${settings.weightUnit}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        loadSettings,
        clearSettings,
        convertWeight,
        toKg,
        formatWeight,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

/**
 * Hook that returns the effective isDarkMode boolean, respecting the user's
 * themeMode setting (light / dark / auto). Use this in every screen/modal
 * instead of `useColorScheme() === 'dark'` so the global theme switch works.
 */
export function useEffectiveDark() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();
  if (settings.themeMode === 'dark') return true;
  if (settings.themeMode === 'light') return false;
  return systemScheme === 'dark'; // 'auto'
}
