import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { TRACKS } from '../config/constants';
import { useLibrary } from '../context/LibraryContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const { analytics } = useLibrary();

  const topTrackEntry = Object.entries(analytics.playByTrackId || {}).sort((a, b) => b[1] - a[1])[0];
  const topTrack = topTrackEntry ? TRACKS.find((track) => track.id === topTrackEntry[0]) : null;

  async function handleLogout() {
    await signOut();
    Alert.alert('Signed out', 'You have been logged out.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.line}>Name: {profile?.name || 'Listener'}</Text>
      <Text style={styles.line}>Email: {profile?.email || 'unknown'}</Text>
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Listening Insights</Text>
        <Text style={styles.line}>Total Plays: {analytics.totalPlays}</Text>
        <Text style={styles.line}>Minutes Listened: {analytics.totalMinutes}</Text>
        <Text style={styles.line}>
          Top Track: {topTrack ? `${topTrack.title} (${topTrackEntry[1]} plays)` : 'No listening data yet'}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 12 },
  line: { color: '#c5d5ee', marginBottom: 8 },
  analyticsCard: {
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#17213b',
    borderColor: '#2b3d66',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12
  },
  analyticsTitle: { color: '#86efac', fontWeight: '700', marginBottom: 6 },
  button: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#f87171',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10
  },
  buttonText: { color: '#3b0a0a', fontWeight: '700' }
});
