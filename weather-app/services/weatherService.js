import * as Location from 'expo-location';
import { DEFAULT_CITY, DEFAULT_STATE, WEATHER_ALERTS } from '../config/constants';

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
  // Mocked provider for offline-friendly demo behavior.
  return {
    temperature: 58,
    feelsLike: 56,
    humidity: 72,
    windMph: 10,
    uv: 2,
    summary: 'Light Rain'
  };
}

export async function fetchForecast() {
  return [
    { id: '1', day: 'Mon', high: 61, low: 49, icon: 'Rain' },
    { id: '2', day: 'Tue', high: 63, low: 50, icon: 'Clouds' },
    { id: '3', day: 'Wed', high: 65, low: 52, icon: 'Sunny' },
    { id: '4', day: 'Thu', high: 62, low: 48, icon: 'Showers' },
    { id: '5', day: 'Fri', high: 60, low: 47, icon: 'Windy' }
  ];
}

export async function fetchAlerts() {
  return WEATHER_ALERTS;
}
