import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const { loading, settings, setMetricUnits, setPushAlerts } = useSettings();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.note}>Loading your preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Use Metric Units</Text>
        <Switch value={settings.metricUnits} onValueChange={setMetricUnits} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Push Weather Alerts</Text>
        <Switch value={settings.pushAlerts} onValueChange={setPushAlerts} />
      </View>

      <Text style={styles.note}>
        Preferences save automatically and apply across dashboard, forecast, and alerts screens.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f4c81', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 16 },
  row: {
    backgroundColor: '#1f78bf',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: { color: '#fff', fontWeight: '600' },
  note: { marginTop: 8, color: '#dbeafe', lineHeight: 20 }
});
