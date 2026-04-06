import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchLibrary } from '../services/musicService';

export default function LibraryScreen() {
  const [library, setLibrary] = useState({ recentlyPlayed: [], savedPlaylists: [] });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchLibrary();
    setLibrary(data);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>
      <Text style={styles.section}>Saved Playlists</Text>
      <FlatList
        data={library.savedPlaylists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.row}>• {item.name} ({item.tracks} tracks)</Text>}
      />
      <Text style={[styles.section, { marginTop: 14 }]}>Recently Played</Text>
      <FlatList
        data={library.recentlyPlayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.row}>• {item.title} — {item.artist}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  section: { color: '#86efac', fontWeight: '700', marginBottom: 8 },
  row: {
    color: '#c5d5ee',
    marginBottom: 6,
    backgroundColor: '#17213b',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2b3d66'
  }
});
