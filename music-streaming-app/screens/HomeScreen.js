import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchFeaturedPlaylists } from '../services/musicService';

export default function HomeScreen() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await fetchFeaturedPlaylists();
    setPlaylists(data);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Streaming</Text>
      <Text style={styles.subtitle}>Featured Playlists</Text>
      {loading ? <ActivityIndicator color="#86efac" /> : null}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.tracks} tracks · {item.mood}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#93a3bf', marginBottom: 12 },
  card: {
    backgroundColor: '#18233d',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2b3d66'
  },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cardSub: { color: '#9bb0d0', marginTop: 2 }
});
