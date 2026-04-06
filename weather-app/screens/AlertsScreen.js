import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchAlerts } from '../services/weatherService';

export default function AlertsScreen() {
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
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
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
  alertTitle: { color: '#1f2937', fontWeight: '700', marginBottom: 4 },
  alertBody: { color: '#334155', lineHeight: 20 }
});
