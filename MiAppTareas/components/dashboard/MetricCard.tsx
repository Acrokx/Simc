import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme';

export function MetricCard({ icon, label, value, status, progress, showProgress }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      {progress !== undefined && showProgress && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(Math.max(progress, 0), 100)}%` }]} />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  icon: { fontSize: 28 },
  value: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  label: { fontSize: 13, color: colors.text.secondary, fontWeight: '600' },
  status: { fontSize: 12, color: colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  progressBar: { height: 6, backgroundColor: colors.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
});
