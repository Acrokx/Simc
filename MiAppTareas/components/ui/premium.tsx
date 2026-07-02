import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme';

interface PremiumCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: boolean;
}

export function PremiumCard({ children, style, accent = false }: PremiumCardProps) {
  return (
    <View style={[styles.card, accent && styles.cardAccent, style]}>
      {children}
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function SectionHeader({ title, subtitle, trailing }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTextWrap}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );
}

interface StatusBadgeProps {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}

const STATUS_TONES = {
  success: { bg: `${colors.primary}15`, text: colors.primary, border: colors.accent },
  warning: { bg: `${colors.warning}15`, text: colors.warning, border: colors.warning },
  danger: { bg: `${colors.error}15`, text: colors.error, border: colors.error },
  neutral: { bg: colors.surface, text: colors.text.secondary, border: colors.border },
} as const;

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const style = STATUS_TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}> 
      <Text style={[styles.badgeText, { color: style.text }]}>{label}</Text>
    </View>
  );
}

interface MetricTileProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export function MetricTile({ icon, label, value, unit, highlight = false }: MetricTileProps) {
  return (
    <View style={[styles.metricTile, highlight && styles.metricTileHighlight]}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}{unit ? ` ${unit}` : ''}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
  },
  cardAccent: {
    borderColor: `${colors.primary}40`,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
    gap: 12,
  },
  sectionTextWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 6,
    lineHeight: 20,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricTile: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  metricTileHighlight: {
    backgroundColor: '#E8F5E9',
    borderColor: `${colors.primary}50`,
  },
  metricIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.8,
  },
  metricLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 6,
    fontWeight: '600',
  },
});
