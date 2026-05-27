import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { fetchForecast, getCurrentLocation } from '../services/weatherService';
import { useSettings } from '../context/SettingsContext';

export default function ForecastScreen() {
  const { settings } = useSettings();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError('');
      setLoading(true);
      const loc = await getCurrentLocation();
      const forecast = await fetchForecast(loc);
      setDays(forecast);
    } catch (_error) {
      setError('Unable to refresh forecast right now.');
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-Day Forecast</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
      <FlatList
        data={days}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No forecast data available.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.temp}>
              {settings.metricUnits ? Math.round(((item.high - 32) * 5) / 9) : item.high}°
              {settings.metricUnits ? 'C' : 'F'} / {settings.metricUnits ? Math.round(((item.low - 32) * 5) / 9) : item.low}°
              {settings.metricUnits ? 'C' : 'F'}
            </Text>
          </View>
        )}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#125d99', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 10 },
  error: {
    color: '#fee2e2',
    backgroundColor: 'rgba(127,29,29,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10
  },
  row: {
    backgroundColor: '#1f78bf',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  day: { color: '#fff', fontWeight: '700' },
  icon: { color: '#fff' },
  temp: { color: '#e6f4ff' },
  empty: { color: '#dbeafe', textAlign: 'center', marginTop: 24 }
});
