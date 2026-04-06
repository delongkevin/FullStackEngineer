import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchAlerts } from '../services/weatherService';
import { useSettings } from '../context/SettingsContext';

export default function AlertsScreen() {
  const { settings } = useSettings();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchAlerts();
    setAlerts(data);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Alerts</Text>
      {!settings.pushAlerts ? (
        <View style={styles.disabledCard}>
          <Text style={styles.alertTitle}>Push alerts are turned off</Text>
          <Text style={styles.alertBody}>Enable notifications in Settings to receive severe weather updates.</Text>
        </View>
      ) : null}
      <FlatList
        data={settings.pushAlerts ? alerts : []}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f4c81', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
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
