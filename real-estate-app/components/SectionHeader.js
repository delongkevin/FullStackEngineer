import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SectionHeader({ title, actionText, onActionPress }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionText && onActionPress ? (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.action}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827'
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669'
  }
});
