import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CITY, DEFAULT_STATE, WEATHER_ALERTS } from '../config/constants';

const CACHE_KEYS = {
  CURRENT: 'weather_current_cache',
  FORECAST: 'weather_forecast_cache',
  ALERTS: 'weather_alerts_cache'
};

async function readCache(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

async function writeCache(key, data) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (_) {
    // Best effort cache write.
  }
}

export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { city: DEFAULT_CITY, state: DEFAULT_STATE, permissionGranted: false };
    }

    const location = await Location.getCurrentPositionAsync({});
    const geo = await Location.reverseGeocodeAsync(location.coords);
    const first = geo[0] || {};

    return {
      city: first.city || DEFAULT_CITY,
      state: first.region || DEFAULT_STATE,
      permissionGranted: true,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  } catch (_) {
    return { city: DEFAULT_CITY, state: DEFAULT_STATE, permissionGranted: false };
  }
}

export async function fetchCurrentWeather() {
  const base = {
    temperature: 58,
    feelsLike: 56,
    humidity: 72,
    windMph: 10,
    uv: 2,
    summary: 'Light Rain'
  };

  try {
    const variation = Math.floor(Math.random() * 3) - 1;
    const current = {
      ...base,
      temperature: base.temperature + variation,
      feelsLike: base.feelsLike + variation,
      fetchedAt: new Date().toISOString()
    };
    await writeCache(CACHE_KEYS.CURRENT, current);
    return current;
  } catch (_) {
    return readCache(CACHE_KEYS.CURRENT, { ...base, fetchedAt: null });
  }
}

export async function fetchForecast() {
  const data = [
    { id: '1', day: 'Mon', high: 61, low: 49, icon: 'Rain' },
    { id: '2', day: 'Tue', high: 63, low: 50, icon: 'Clouds' },
    { id: '3', day: 'Wed', high: 65, low: 52, icon: 'Sunny' },
    { id: '4', day: 'Thu', high: 62, low: 48, icon: 'Showers' },
    { id: '5', day: 'Fri', high: 60, low: 47, icon: 'Windy' }
  ];

  try {
    await writeCache(CACHE_KEYS.FORECAST, data);
    return data;
  } catch (_) {
    return readCache(CACHE_KEYS.FORECAST, data);
  }
}

export async function fetchAlerts() {
  try {
    await writeCache(CACHE_KEYS.ALERTS, WEATHER_ALERTS);
    return WEATHER_ALERTS;
  } catch (_) {
    return readCache(CACHE_KEYS.ALERTS, WEATHER_ALERTS);
  }
}
