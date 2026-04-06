import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchCurrentWeather, getCurrentLocation } from '../services/weatherService';

export default function DashboardScreen() {
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
      <Text style={styles.temp}>{weather.temperature}°</Text>
      <Text style={styles.summary}>{weather.summary} - Feels like {weather.feelsLike}°</Text>
      <Text style={styles.meta}>Humidity {weather.humidity}% · Wind {weather.windMph} mph · UV {weather.uv}</Text>
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
  meta: { color: '#cfe7ff', marginTop: 8 }
});
