import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useRouter } from 'expo-router';
import { removeItem } from '../../lib/storage';

interface SidebarItem {
  icon: string;
  label: string;
  route: string;
}

const MENU_ITEMS: SidebarItem[] = [
  { icon: '📊', label: 'Dashboard', route: '/(admin)/dashboard' },
  { icon: '👥', label: 'Usuarios', route: '/(admin)/usuarios' },
  { icon: '🏡', label: 'Fincas', route: '/(admin)/fincas' },
  { icon: '🌱', label: 'Cultivos', route: '/(admin)/cultivos' },
  { icon: '📡', label: 'Sensores', route: '/(admin)/sensores' },
  { icon: '🚨', label: 'Alertas', route: '/(admin)/alertas' },
  { icon: '⚙️', label: 'Configuración', route: '/(admin)/configuracion/sistema' },
  { icon: '👤', label: 'Perfil', route: '/(admin)/perfil' },
];

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await removeItem('userData');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.logo}>SIMC</Text>
      </View>
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.route} style={styles.item} onPress={() => router.push(item.route as any)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: colors.card,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  menu: {
    flex: 1,
    paddingVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
    marginHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: `${colors.error}12`,
    borderRadius: 14,
    gap: 10,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
});
