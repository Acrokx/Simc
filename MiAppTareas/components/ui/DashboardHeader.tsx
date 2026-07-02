import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

interface DashboardHeaderProps {
  userName?: string;
  farmName?: string;
  notificationCount?: number;
  role?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

export function DashboardHeader({
  userName = "Cristhian",
  farmName = "Panel Administrativo",
  notificationCount = 3,
  role = "Administrador",
  onMenuPress,
  onNotificationPress
}: DashboardHeaderProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
  const now = new Date();
  const dateLabel = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' });
  const timeLabel = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const avatar = userName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}, {userName}</Text>
          <Text style={styles.farmName}>{farmName}</Text>
        </View>

        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatar}</Text>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>{role} • SIMC</Text>
          </View>
        </View>

        <View style={styles.metaCard}>
          <Text style={styles.metaDate}>{dateLabel}</Text>
          <Text style={styles.metaTime}>{timeLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: colors.background,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    fontSize: 22,
    color: colors.text.primary,
    fontWeight: '700',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  farmName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.card,
    fontSize: 10,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 220,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  userRole: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  metaCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    minWidth: 140,
    alignItems: 'flex-end',
  },
  metaDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  metaTime: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 2,
  },
});
