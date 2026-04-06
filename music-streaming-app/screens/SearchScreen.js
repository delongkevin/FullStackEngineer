import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { TRACKS } from '../config/constants';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query) return TRACKS;
    const q = query.toLowerCase();
    return TRACKS.filter((track) => track.title.toLowerCase().includes(q) || track.artist.toLowerCase().includes(q));
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search songs or artists"
        style={styles.input}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.artist} · {item.duration}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16 },
  header: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#18233d',
    borderColor: '#2b3d66',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  row: {
    backgroundColor: '#18233d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2b3d66',
    padding: 12,
    marginBottom: 8
  },
  title: { color: '#fff', fontWeight: '700' },
  sub: { color: '#9bb0d0', marginTop: 2 }
});
