import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface SensorStatusProps {
  sensores: { tipo_sensor: string; estado: string; activo: boolean }[];
}

export function SensorStatus({ sensores }: SensorStatusProps) {
  const total = sensores.length || 1;
  const activos = sensores.filter(s => s.activo).length;
  const inactivos = total - activos;
  const activoWidth = (activos / total) * 100;
  const inactivoWidth = (inactivos / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Estado de Sensores</Text>
        <Text style={styles.count}>{activos}/{total} activos</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.segment, styles.active, { width: `${activoWidth}%` }]} />
        <View style={[styles.segment, styles.inactive, { width: `${inactivoWidth}%` }]} />
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Activos</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Inactivos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  track: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: colors.surface,
  },
  segment: {
    height: '100%',
  },
  active: {
    backgroundColor: colors.success,
  },
  inactive: {
    backgroundColor: colors.error,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
});
