import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../theme';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export function Loader({ size = 'large', color = colors.primary, text }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  text: { fontSize: 14, color: colors.text.secondary, fontWeight: '600' },
});
