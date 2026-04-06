import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import { login as loginService } from '../services/musicService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    setToken(storedToken);
    setProfile(storedProfile ? JSON.parse(storedProfile) : null);
    setLoading(false);
  }

  async function signIn(email, password) {
    const result = await loginService(email, password);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(result.profile));
    setToken(result.token);
    setProfile(result.profile);
  }

  async function signOut() {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
    setToken(null);
    setProfile(null);
  }

  const value = useMemo(() => ({ loading, token, profile, signIn, signOut }), [loading, token, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
