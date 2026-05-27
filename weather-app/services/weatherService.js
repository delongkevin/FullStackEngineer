import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CITY, DEFAULT_STATE, WEATHER_ALERTS } from '../config/constants';

const CACHE_KEYS = {
  CURRENT: 'weather_current_cache',
  FORECAST: 'weather_forecast_cache',
  ALERTS: 'weather_alerts_cache'
};

const CACHE_TTL_MS = 15 * 60 * 1000;
const DEFAULT_COORDS = {
  latitude: 47.6062,
  longitude: -122.3321
};

const WEATHER_LABELS = {
  0: 'Clear',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Heavy Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Severe Thunderstorm'
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

function toCacheRecord(data) {
  return {
    savedAt: Date.now(),
    data
  };
}

async function readFreshCache(key, fallback) {
  const cached = await readCache(key, null);

  if (!cached) {
    return { data: fallback, stale: true };
  }

  // Backward compatibility for old raw cached payloads.
  if (cached.data === undefined) {
    return { data: cached, stale: true };
  }

  const stale = Date.now() - cached.savedAt > CACHE_TTL_MS;
  return { data: stale ? fallback : cached.data, stale };
}

async function readAnyCache(key, fallback) {
  const cached = await readCache(key, null);

  if (!cached) {
    return fallback;
  }

  return cached.data === undefined ? cached : cached.data;
}

function mapWeatherCode(code) {
  return WEATHER_LABELS[code] || 'Unknown';
}

function forecastIcon(code) {
  if (code >= 95) return 'Storm';
  if (code >= 80) return 'Showers';
  if (code >= 71) return 'Snow';
  if (code >= 61) return 'Rain';
  if (code >= 45) return 'Fog';
  if (code >= 1) return 'Clouds';
  return 'Sunny';
}

function buildForecastDays(daily) {
  const days = [];
  const size = Math.min(5, daily?.time?.length || 0);

  for (let i = 0; i < size; i += 1) {
    const date = new Date(daily.time[i]);
    days.push({
      id: String(i + 1),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      icon: forecastIcon(daily.weather_code[i])
    });
  }

  return days;
}

function buildOpenMeteoUrl(location) {
  const latitude = location?.latitude || DEFAULT_COORDS.latitude;
  const longitude = location?.longitude || DEFAULT_COORDS.longitude;
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph'
  });

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

async function fetchProviderWeather(location) {
  const response = await fetch(buildOpenMeteoUrl(location));
  if (!response.ok) {
    throw new Error(`Weather provider request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.current || !payload?.daily) {
    throw new Error('Weather provider returned incomplete payload');
  }

  const current = {
    temperature: Math.round(payload.current.temperature_2m),
    feelsLike: Math.round(payload.current.apparent_temperature),
    humidity: Math.round(payload.current.relative_humidity_2m),
    windMph: Math.round(payload.current.wind_speed_10m),
    uv: Math.round(payload.current.uv_index || 0),
    summary: mapWeatherCode(payload.current.weather_code),
    source: 'provider',
    fetchedAt: new Date().toISOString()
  };

  const forecast = buildForecastDays(payload.daily);
  return { current, forecast };
}

export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        city: DEFAULT_CITY,
        state: DEFAULT_STATE,
        permissionGranted: false,
        latitude: DEFAULT_COORDS.latitude,
        longitude: DEFAULT_COORDS.longitude
      };
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
    return {
      city: DEFAULT_CITY,
      state: DEFAULT_STATE,
      permissionGranted: false,
      latitude: DEFAULT_COORDS.latitude,
      longitude: DEFAULT_COORDS.longitude
    };
  }
}

export async function fetchCurrentWeather(location) {
  const fallback = {
    temperature: 58,
    feelsLike: 56,
    humidity: 72,
    windMph: 10,
    uv: 2,
    summary: 'Light Rain',
    source: 'fallback',
    fetchedAt: null
  };

  try {
    const { data: cached, stale } = await readFreshCache(CACHE_KEYS.CURRENT, null);
    if (cached && !stale) {
      return { ...cached, source: cached.source || 'cache' };
    }

    const provider = await fetchProviderWeather(location);
    await writeCache(CACHE_KEYS.CURRENT, toCacheRecord(provider.current));
    await writeCache(CACHE_KEYS.FORECAST, toCacheRecord(provider.forecast));
    return provider.current;
  } catch (_error) {
    const cached = await readAnyCache(CACHE_KEYS.CURRENT, null);
    if (cached) {
      return { ...cached, source: 'cache' };
    }

    return fallback;
  }
}

export async function fetchForecast(location) {
  const fallback = [
    { id: '1', day: 'Mon', high: 61, low: 49, icon: 'Rain' },
    { id: '2', day: 'Tue', high: 63, low: 50, icon: 'Clouds' },
    { id: '3', day: 'Wed', high: 65, low: 52, icon: 'Sunny' },
    { id: '4', day: 'Thu', high: 62, low: 48, icon: 'Showers' },
    { id: '5', day: 'Fri', high: 60, low: 47, icon: 'Windy' }
  ];

  try {
    const { data: cached, stale } = await readFreshCache(CACHE_KEYS.FORECAST, null);
    if (cached && !stale) {
      return cached;
    }

    const provider = await fetchProviderWeather(location);
    await writeCache(CACHE_KEYS.CURRENT, toCacheRecord(provider.current));
    await writeCache(CACHE_KEYS.FORECAST, toCacheRecord(provider.forecast));
    return provider.forecast;
  } catch (_error) {
    const cached = await readAnyCache(CACHE_KEYS.FORECAST, null);
    return cached || fallback;
  }
}

export async function fetchAlerts(context = {}) {
  const { currentWeather } = context;

  const derived = [];
  if (currentWeather?.windMph >= 25) {
    derived.push({
      id: 'derived_wind',
      title: 'Wind Advisory',
      message: 'Sustained winds are elevated. Use caution for high-profile vehicles and outdoor activity.',
      severity: 'warning'
    });
  }

  if (currentWeather?.uv >= 7) {
    derived.push({
      id: 'derived_uv',
      title: 'High UV Index',
      message: 'UV exposure is high. Consider SPF protection and minimizing direct midday sun.',
      severity: 'info'
    });
  }

  if (currentWeather?.summary?.toLowerCase().includes('thunder')) {
    derived.push({
      id: 'derived_storm',
      title: 'Thunderstorm Risk',
      message: 'Thunderstorm conditions detected nearby. Delay outdoor plans if possible.',
      severity: 'warning'
    });
  }

  const resolvedAlerts = derived.length > 0 ? derived : WEATHER_ALERTS;

  try {
    await writeCache(CACHE_KEYS.ALERTS, toCacheRecord(resolvedAlerts));
    return resolvedAlerts;
  } catch (_error) {
    const cached = await readAnyCache(CACHE_KEYS.ALERTS, null);
    return cached || WEATHER_ALERTS;
  }
}
