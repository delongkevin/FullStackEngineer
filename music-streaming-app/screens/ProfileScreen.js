import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    Alert.alert('Signed out', 'You have been logged out.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.line}>Name: {profile?.name || 'Listener'}</Text>
      <Text style={styles.line}>Email: {profile?.email || 'unknown'}</Text>
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
