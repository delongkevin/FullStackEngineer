import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useLibrary } from '../context/LibraryContext';

export default function LibraryScreen() {
  const { loading, recentlyPlayed, savedPlaylists } = useLibrary();

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#86efac" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>
      <Text style={styles.section}>Saved Playlists</Text>
      <FlatList
        data={savedPlaylists}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No saved playlists yet.</Text>}
        renderItem={({ item }) => <Text style={styles.row}>• {item.name} ({item.tracks} tracks)</Text>}
      />
      <Text style={[styles.section, { marginTop: 14 }]}>Recently Played</Text>
      <FlatList
        data={recentlyPlayed}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Start playing tracks to build history.</Text>}
        renderItem={({ item }) => <Text style={styles.row}>• {item.title} — {item.artist}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, backgroundColor: '#0b111f', alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  section: { color: '#86efac', fontWeight: '700', marginBottom: 8 },
  empty: { color: '#93a3bf', marginBottom: 12 },
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
