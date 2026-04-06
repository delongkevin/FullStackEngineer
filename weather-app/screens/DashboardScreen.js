import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.city}>Seattle, WA</Text>
      <Text style={styles.temp}>58°</Text>
      <Text style={styles.summary}>Light Rain - Feels like 56°</Text>
      <Text style={styles.meta}>Humidity 72% · Wind 10 mph · UV 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f4c81',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  city: { color: '#dbeafe', fontSize: 22, fontWeight: '700' },
  temp: { color: '#fff', fontSize: 72, fontWeight: '700', marginVertical: 8 },
  summary: { color: '#ecfeff', fontSize: 16 },
  meta: { color: '#cfe7ff', marginTop: 8 }
});
