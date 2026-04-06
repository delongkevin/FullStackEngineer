import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { fetchForecast } from '../services/weatherService';

export default function ForecastScreen() {
  const [days, setDays] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const forecast = await fetchForecast();
    setDays(forecast);
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-Day Forecast</Text>
      <FlatList
        data={days}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
