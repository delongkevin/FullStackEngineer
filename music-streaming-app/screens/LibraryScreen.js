import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>
      <Text style={styles.copy}>Liked songs, albums, artists, and saved playlists appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  copy: { color: '#9bb0d0', lineHeight: 20 }
});
