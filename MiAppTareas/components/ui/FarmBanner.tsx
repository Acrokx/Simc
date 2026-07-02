import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme';

interface FarmBannerProps {
  imageUrl?: string;
  farmName?: string;
  status?: string;
  description?: string;
  statusIcon?: string;
}

export function FarmBanner({
  imageUrl = "https://images.unsplash.com/photo-1500382800860-a57b2f6e64ab?w=800&h=400&fit=crop&q=80",
  farmName = "Finca El Porvenir",
  status = "Saludable",
  description = "Todo está bajo control",
  statusIcon = "✅"
}: FarmBannerProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Estado General del Cultivo</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusValue}>{status}</Text>
              <Text style={styles.statusDescription}>{description}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  statusCard: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    fontSize: 36,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.card,
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
});
