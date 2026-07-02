import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface BarChartProps {
  data: number[];
  height?: number;
  color?: string;
  labels?: string[];
}

export function BarChart({ data, height = 160, color = colors.primary, labels }: BarChartProps) {
  const max = Math.max(...data, 1);
  const barWidth = 100 / data.length;

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        {data.map((value, index) => {
          const normalizedHeight = (value / max) * 80;
          return (
            <View key={index} style={[styles.barWrapper, { width: `${barWidth}%` }]}>
              <View style={[styles.bar, { height: normalizedHeight, backgroundColor: color }]} />
              {labels && labels[index] ? (
                <Text style={styles.label}>{labels[index]}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  label: {
    fontSize: 10,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
