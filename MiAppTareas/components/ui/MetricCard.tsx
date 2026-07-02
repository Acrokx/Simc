import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  status?: string;
  progress?: number;
  progressColor?: string;
  showProgress?: boolean;
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  status,
  progress = 0,
  progressColor = colors.primary,
  showProgress = false,
}: MetricCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        <View style={styles.iconBadge}><Text style={styles.icon}>{icon}</Text></View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {status ? <Text style={styles.status}>{status}</Text> : null}
      {showProgress && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: progressColor }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 180,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    gap: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.8,
  },
  unit: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
