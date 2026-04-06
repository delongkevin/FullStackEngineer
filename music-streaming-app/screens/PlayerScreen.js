import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayerScreen() {
  const [status, setStatus] = useState('Paused');

  return (
    <View style={styles.container}>
      <Text style={styles.song}>Refactor Dreams</Text>
      <Text style={styles.artist}>Loop Theory</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => setStatus('Playing')}>
          <Text style={styles.btnText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setStatus('Paused')}>
          <Text style={styles.btnText}>Pause</Text>
        </TouchableOpacity>
      </View>
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
  btnText: { color: '#08210f', fontWeight: '700' }
});
