import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'weather_app_settings_v1';

const defaultSettings = {
  metricUnits: false,
  pushAlerts: true
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [loading, settings]);

  async function bootstrap() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      }
    } finally {
      setLoading(false);
    }
  }

  function setMetricUnits(value) {
    setSettings((prev) => ({ ...prev, metricUnits: value }));
  }

  function setPushAlerts(value) {
    setSettings((prev) => ({ ...prev, pushAlerts: value }));
  }

  const value = useMemo(
    () => ({
      loading,
      settings,
      setMetricUnits,
      setPushAlerts
    }),
    [loading, settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
