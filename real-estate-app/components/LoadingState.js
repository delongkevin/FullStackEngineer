import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingState({ message = 'Loading...', fullScreen = true }) {
  return (
    <View style={[styles.container, !fullScreen && styles.inlineContainer]}>
      <ActivityIndicator size="large" color="#059669" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb'
  },
  inlineContainer: {
    flex: 0,
    paddingVertical: 24,
    backgroundColor: 'transparent'
  },
  message: {
    marginTop: 10,
    color: '#374151',
    fontSize: 14,
    fontWeight: '500'
  }
});
