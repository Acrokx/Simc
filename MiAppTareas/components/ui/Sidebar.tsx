import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme';
import { useRouter, usePathname } from 'expo-router';
import { removeItem } from '../../lib/storage';

interface SidebarItem {
    icon: string;
    label: string;
    route: string;
    children?: SidebarItem[];
}

interface SidebarGroup {
    title: string;
    items: SidebarItem[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: 'General',
    items: [
      { icon: '📊', label: 'Dashboard', route: '/(admin)/dashboard' },
    ],
  },
  {
    title: 'Administración',
    items: [
      { icon: '👥', label: 'Usuarios', route: '/(admin)/usuarios' },
    ],
  },
  {
    title: 'Gestión Agrícola',
    items: [
      { icon: '🏡', label: 'Fincas', route: '/(admin)/fincas' },
      { icon: '🌱', label: 'Cultivos', route: '/(admin)/cultivos' },
      { icon: '📡', label: 'Sensores', route: '/(admin)/sensores' },
    ],
  },
  {
    title: 'Monitoreo',
    items: [
      { icon: '📈', label: 'Estadísticas', route: '/(admin)/mediciones' },
      { icon: '🚨', label: 'Alertas', route: '/(admin)/alertas' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { icon: '⚙️', label: 'Configuración', route: '/(admin)/configuracion/sistema' },
      { icon: '👤', label: 'Perfil', route: '/(admin)/perfil' },
    ],
  },
];

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const handlePress = (route: string) => {
        router.push(route as any);
    };

    const isActive = (route: string) => {
        if (pathname === route) return true;
        return false;
    };

    return (
        <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.toggleButton} onPress={() => setCollapsed((value) => !value)}>
                    <Text style={styles.toggleIcon}>{collapsed ? '›' : '‹'}</Text>
                </TouchableOpacity>
                {!collapsed && <Text style={styles.logo}>SIMC Admin</Text>}
            </View>
            <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
                {SIDEBAR_GROUPS.map((group) => (
                    <View key={group.title} style={styles.group}>
                        {!collapsed && <Text style={styles.groupTitle}>{group.title}</Text>}
                        {group.items.map((item) => {
                            const active = isActive(item.route);
                            return (
                                <TouchableOpacity
                                    key={item.route + item.label}
                                    style={[styles.item, active && styles.activeItem]}
                                    onPress={() => handlePress(item.route)}
                                >
                                    <Text style={styles.icon}>{item.icon}</Text>
                                    {!collapsed && <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                    (async () => {
                        await removeItem('userData');
                        router.replace('/(auth)/login');
                    })();
                }}>
                    <Text style={styles.logoutText}>{collapsed ? '↩' : 'Cerrar sesión'}</Text>
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
    sidebarCollapsed: {
        width: 84,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    toggleButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleIcon: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
    },
    logo: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text.primary,
        letterSpacing: -0.4,
        flex: 1,
    },
    menu: {
        flex: 1,
        paddingVertical: 10,
    },
    group: {
        marginBottom: 10,
    },
    groupTitle: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        color: colors.text.muted,
        paddingHorizontal: 16,
        marginBottom: 6,
        marginTop: 6,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        paddingHorizontal: 16,
        gap: 12,
        marginHorizontal: 10,
        borderRadius: 14,
        marginBottom: 4,
    },
    activeItem: {
        backgroundColor: `${colors.primary}15`,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
    },
    icon: {
        fontSize: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
    },
    activeLabel: {
        color: colors.primary,
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
        paddingVertical: 12,
        backgroundColor: `${colors.error}12`,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        color: colors.error,
        fontSize: 13,
        fontWeight: '600',
    },
});