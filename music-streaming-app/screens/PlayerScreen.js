import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TRACKS } from '../config/constants';

export default function PlayerScreen() {
  const [status, setStatus] = useState('Paused');
  const [index, setIndex] = useState(0);
  const current = TRACKS[index];

  function nextTrack() {
    setIndex((i) => (i + 1) % TRACKS.length);
    setStatus('Playing');
  }

  function prevTrack() {
    setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setStatus('Playing');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.song}>{current.title}</Text>
      <Text style={styles.artist}>{current.artist}</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={prevTrack}>
          <Text style={styles.btnText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setStatus('Playing')}>
          <Text style={styles.btnText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setStatus('Paused')}>
          <Text style={styles.btnText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={nextTrack}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.queueTitle}>Queue</Text>
      <FlatList
        data={TRACKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index: itemIndex }) => (
          <TouchableOpacity
            style={[styles.queueRow, itemIndex === index && styles.queueRowActive]}
            onPress={() => {
              setIndex(itemIndex);
              setStatus('Playing');
            }}
          >
            <Text style={styles.queueText}>{item.title} · {item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16, justifyContent: 'center' },
  song: { color: '#fff', fontSize: 30, fontWeight: '700', textAlign: 'center' },
  artist: { color: '#9bb0d0', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  status: { color: '#86efac', textAlign: 'center', marginBottom: 14, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  btn: { backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#08210f', fontWeight: '700' },
  queueTitle: { color: '#86efac', fontWeight: '700', marginTop: 18, marginBottom: 8 },
  queueRow: {
    backgroundColor: '#17213b',
    borderColor: '#2b3d66',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    padding: 10
  },
  queueRowActive: {
    borderColor: '#86efac'
  },
  queueText: {
    color: '#c5d5ee'
  }
});
