import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useRouter } from 'expo-router';

export function NotificationMenu({ count = 0, onPress }: { count?: number; onPress?: () => void }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.container} onPress={() => { onPress?.(); router.push('/(admin)/alertas'); }}>
      <Text style={styles.icon}>🔔</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', padding: 8 },
  icon: { fontSize: 22 },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: colors.error, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: colors.background },
  badgeText: { color: colors.card, fontSize: 10, fontWeight: '800' },
});
