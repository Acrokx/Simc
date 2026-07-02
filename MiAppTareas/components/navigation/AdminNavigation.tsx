import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme';

export { ADMIN_BOTTOM_NAV, AGRICULTOR_BOTTOM_NAV, ADMIN_EXTRA_ROUTES } from '../ui/navigation';

export function AdminNavigation() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard')}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.label}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/cultivos')}>
        <Text style={styles.icon}>🌱</Text>
        <Text style={styles.label}>Cultivos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/sensores')}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.label}>Sensores</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/alertas')}>
        <Text style={styles.icon}>🚨</Text>
        <Text style={styles.label}>Alertas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/perfil')}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.label}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  navItem: { alignItems: 'center', gap: 4 },
  icon: { fontSize: 20 },
  label: { fontSize: 11, fontWeight: '600', color: colors.text.secondary },
});
