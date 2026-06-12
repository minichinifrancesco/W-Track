import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const STORAGE_KEY = 'app_settings';

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
  convertWeight: (v) => v,
  formatWeight: (v) => `${v} kg`,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch (_) {}
      }
    });
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
    <SettingsContext.Provider value={{ settings, updateSetting, convertWeight, toKg, formatWeight }}>
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
