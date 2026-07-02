import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface RecommendationCardProps {
  title?: string;
  message: string;
  actionLabel?: string;
}

export function RecommendationCard({
  title = "Recomendación IA",
  message,
  actionLabel,
}: RecommendationCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>🤖</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
      {actionLabel ? (
        <View style={styles.actionContainer}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.successBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: -0.3,
  },
  messageContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  message: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  actionLabel: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '700',
  },
});
