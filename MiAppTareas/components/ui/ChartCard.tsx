import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PremiumCard } from './premium';
import { colors } from '../../theme';

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  data?: number[];
  color?: string;
}

export function ChartCard({ title, subtitle, data = [], color = colors.primary }: ChartCardProps) {
  const max = Math.max(...data, 1);
  return (
    <PremiumCard style={styles.card}>
      <View style={styles.header}>
        <View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.chartRow}>
        {data.length === 0 ? (
          <View style={styles.noData}><Text style={styles.noDataText}>Sin datos</Text></View>
        ) : (
          data.map((v, i) => (
            <View key={i} style={[styles.barWrap]}>
              <View
                style={[
                  styles.bar,
                  { height: `${Math.round((v / max) * 100)}%`, backgroundColor: color },
                ]}
              />
            </View>
          ))
        )}
      </View>
    </PremiumCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 80,
  },
  barWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 6,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  noDataText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
});

