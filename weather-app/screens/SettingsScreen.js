import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [metricUnits, setMetricUnits] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Use Metric Units</Text>
        <Switch value={metricUnits} onValueChange={setMetricUnits} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Push Weather Alerts</Text>
        <Switch value={pushAlerts} onValueChange={setPushAlerts} />
      </View>

      <Text style={styles.note}>
        These settings are local defaults and can be connected to account preferences in the next phase.
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
