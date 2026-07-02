import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertCardProps {
  title: string;
  description: string;
  date: string;
  type: AlertType;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export function AlertCard({ title, description, date, type, onPress, rightElement }: AlertCardProps) {
  const config = {
    success: { icon: '✅', color: colors.success, bg: colors.successBg, label: 'Completado' },
    warning: { icon: '⚠️', color: colors.warning, bg: colors.warningBg, label: 'Advertencia' },
    error: { icon: '🚨', color: colors.error, bg: colors.errorBg, label: 'Crítica' },
    info: { icon: 'ℹ️', color: colors.primary, bg: colors.surface, label: 'Info' },
  }[type];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.typeBadge, { backgroundColor: config.bg, borderColor: config.color }]}>
            <Text style={[styles.typeBadgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {rightElement ? (
        <View style={styles.arrowContainer}>{rightElement}</View>
      ) : (
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
  },
  arrowContainer: {
    paddingLeft: 4,
  },
  arrow: {
    fontSize: 28,
    color: colors.text.muted,
    fontWeight: '300',
  },
});
