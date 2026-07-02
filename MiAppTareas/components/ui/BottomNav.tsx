import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors } from '../../theme';

type NavRoute =
  | "/home"
  | "/cultivos"
  | "/mediciones"
  | "/alertas"
  | "/perfil"
  | "/agricultor"
  | "/fincas"
  | "/sensores"
  | "/admin"
  | "/admin-dashboard"
  | "/dashboard";

type NavItem = {
  icon: string;
  label: string;
  route: NavRoute;
};

interface BottomNavProps {
  items: readonly NavItem[];
  activeRoute?: NavRoute;
  onPress: (route: NavRoute) => void;
}

export function BottomNav({ items, activeRoute, onPress }: BottomNavProps) {
  if (!items || !Array.isArray(items)) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {items.map((item) => {
          const isActive = activeRoute === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={styles.item}
              onPress={() => onPress(item.route)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Text style={[styles.icon, isActive && styles.iconActive]}>
                  {item.icon}
                </Text>
              </View>
              <Text
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  inner: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    gap: 4,
  },
  item: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    backgroundColor: "transparent",
  },
  iconWrapActive: {
    backgroundColor: `${colors.primary}18`,
    borderRadius: 12,
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
