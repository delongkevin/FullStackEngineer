import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Alerts</Text>
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>Wind Advisory</Text>
        <Text style={styles.alertBody}>Strong gusts expected between 5 PM and 10 PM. Secure loose outdoor items.</Text>
      </View>
      <View style={styles.alertCardSecondary}>
        <Text style={styles.alertTitle}>Rain Outlook</Text>
        <Text style={styles.alertBody}>Intermittent rainfall expected overnight with reduced visibility during commute.</Text>
      </View>
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
