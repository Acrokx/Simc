import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useRouter } from 'expo-router';

interface BreadcrumbProps {
  items: { label: string; route?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <View style={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={`${item.label}-${index}`} style={styles.crumbContainer}>
            {index > 0 && <Text style={styles.separator}>›</Text>}
            {item.route && !isLast ? (
              <TouchableOpacity onPress={() => router.push(item.route as any)}>
                <Text style={styles.crumbLink}>{item.label}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.crumb, isLast ? styles.activeCrumb : styles.inactiveCrumb]}>{item.label}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  crumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    color: colors.text.muted,
    fontSize: 16,
    marginHorizontal: 4,
  },
  crumb: {
    fontSize: 13,
    fontWeight: '600',
  },
  crumbLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  activeCrumb: {
    color: colors.text.primary,
  },
  inactiveCrumb: {
    color: colors.text.secondary,
  },
});
