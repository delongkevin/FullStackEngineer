import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchCurrentWeather, getCurrentLocation } from '../services/weatherService';
import { useSettings } from '../context/SettingsContext';

export default function DashboardScreen() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState({ city: 'Loading', state: '' });
  const [weather, setWeather] = useState({
    temperature: 0,
    feelsLike: 0,
    summary: 'Loading',
    humidity: 0,
    windMph: 0,
    uv: 0
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [loc, current] = await Promise.all([getCurrentLocation(), fetchCurrentWeather()]);
    setLocation({ city: loc.city, state: loc.state });
    setWeather(current);
    setLoading(false);
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const displayTemp = settings.metricUnits ? Math.round(((weather.temperature - 32) * 5) / 9) : weather.temperature;
  const displayFeels = settings.metricUnits ? Math.round(((weather.feelsLike - 32) * 5) / 9) : weather.feelsLike;
  const displayWind = settings.metricUnits ? Math.round(weather.windMph * 1.609) : weather.windMph;
  const tempUnit = settings.metricUnits ? 'C' : 'F';
  const windUnit = settings.metricUnits ? 'km/h' : 'mph';
  const riskScore = Math.min(100, weather.humidity + weather.windMph * 2 + weather.uv * 5);
  const riskLabel = riskScore >= 75 ? 'High' : riskScore >= 45 ? 'Moderate' : 'Low';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.city}>{location.city}, {location.state}</Text>
      <Text style={styles.temp}>{displayTemp}°{tempUnit}</Text>
      <Text style={styles.summary}>{weather.summary} - Feels like {displayFeels}°{tempUnit}</Text>
      <Text style={styles.meta}>Humidity {weather.humidity}% · Wind {displayWind} {windUnit} · UV {weather.uv}</Text>
      <Text style={styles.risk}>Outdoor Risk Index: {riskLabel} ({Math.round(riskScore)})</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f4c81',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#0f4c81'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  city: { color: '#dbeafe', fontSize: 22, fontWeight: '700' },
  temp: { color: '#fff', fontSize: 72, fontWeight: '700', marginVertical: 8 },
  summary: { color: '#ecfeff', fontSize: 16 },
  meta: { color: '#cfe7ff', marginTop: 8 },
  risk: { color: '#fef3c7', marginTop: 8, fontWeight: '700' }
});
