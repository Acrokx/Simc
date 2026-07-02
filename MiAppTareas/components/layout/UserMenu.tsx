import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useRouter } from 'expo-router';

export function UserMenu() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/(admin)/perfil')}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>A</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.name}>Admin</Text>
        <Text style={styles.role}>Administrador</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.card, fontSize: 14, fontWeight: '700' },
  meta: { gap: 2 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text.primary },
  role: { fontSize: 12, color: colors.text.secondary },
});
