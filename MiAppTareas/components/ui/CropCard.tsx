import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme';

interface CropCardProps {
  name: string;
  emoji: string;
  status: string;
  humidity: string;
  temperature: string;
  ambientHumidity: string;
  plantingDate: string;
  imageUrl?: string;
  onPress?: () => void;
  onDetailPress?: () => void;
}

export function CropCard({
  name,
  emoji,
  status,
  humidity,
  temperature,
  ambientHumidity,
  plantingDate,
  imageUrl = "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop&q=80",
  onPress,
  onDetailPress,
}: CropCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={[styles.statusBadge, status === 'Saludable' ? styles.statusHealthy : styles.statusWarning]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{humidity}</Text>
            <Text style={styles.metricLabel}>Humedad</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{temperature}</Text>
            <Text style={styles.metricLabel}>Temp.</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{ambientHumidity}</Text>
            <Text style={styles.metricLabel}>Amb.</Text>
          </View>
        </View>
        <Text style={styles.date}>Siembra: {plantingDate}</Text>
        <TouchableOpacity onPress={onDetailPress} style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 36,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.warning,
  },
  statusHealthy: {
    backgroundColor: colors.success,
  },
  statusWarning: {
    backgroundColor: colors.warning,
  },
  statusText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.card,
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 8,
  },
  metricItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  metricLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  detailButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 8,
  },
  detailButtonText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '700',
  },
});
