import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmptyState({
  title,
  message,
  actionText,
  onActionPress,
  compact = false
}) {
  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionText && onActionPress ? (
        <TouchableOpacity style={styles.button} onPress={onActionPress}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  compactContainer: {
    flex: 0,
    paddingVertical: 32
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320
  },
  button: {
    marginTop: 16,
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  }
});
