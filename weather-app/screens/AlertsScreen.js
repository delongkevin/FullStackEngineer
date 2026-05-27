import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { fetchAlerts, fetchCurrentWeather, getCurrentLocation } from '../services/weatherService';
import { useSettings } from '../context/SettingsContext';

export default function AlertsScreen() {
  const { settings } = useSettings();
  const [alerts, setAlerts] = useState([]);
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
      const current = await fetchCurrentWeather(loc);
      const data = await fetchAlerts({ currentWeather: current, location: loc });
      setAlerts(data);
    } catch (_error) {
      setError('Unable to load alerts right now.');
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
      <Text style={styles.title}>Weather Alerts</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!settings.pushAlerts ? (
        <View style={styles.disabledCard}>
          <Text style={styles.alertTitle}>Push alerts are turned off</Text>
          <Text style={styles.alertBody}>Enable notifications in Settings to receive severe weather updates.</Text>
        </View>
      ) : null}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={settings.pushAlerts ? alerts : []}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            settings.pushAlerts ? <Text style={styles.empty}>No active alerts right now.</Text> : null
          }
          renderItem={({ item }) => (
            <View style={item.severity === 'warning' ? styles.alertCard : styles.alertCardSecondary}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              <Text style={styles.alertBody}>{item.message}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f4c81', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  error: {
    color: '#fee2e2',
    backgroundColor: 'rgba(127,29,29,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10
  },
  alertCard: {
    backgroundColor: '#fde68a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  alertCardSecondary: {
    backgroundColor: '#bfdbfe',
    borderRadius: 12,
    padding: 12
  },
  disabledCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  empty: { color: '#dbeafe' },
  alertTitle: { color: '#1f2937', fontWeight: '700', marginBottom: 4 },
  alertBody: { color: '#334155', lineHeight: 20 }
});
