import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const days = [
  { id: '1', day: 'Mon', high: 61, low: 49, icon: '🌧️' },
  { id: '2', day: 'Tue', high: 63, low: 50, icon: '⛅' },
  { id: '3', day: 'Wed', high: 65, low: 52, icon: '☀️' },
  { id: '4', day: 'Thu', high: 62, low: 48, icon: '🌦️' }
];

export default function ForecastScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-Day Forecast</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.temp}>{item.high}° / {item.low}°</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#125d99', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 10 },
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
  temp: { color: '#e6f4ff' }
});
