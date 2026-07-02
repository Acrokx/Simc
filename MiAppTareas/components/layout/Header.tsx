import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
}

export function Header({ title = 'SIMC', onMenuPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      {onMenuPress && (
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: { fontSize: 22, color: colors.text.primary, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: colors.text.primary, flex: 1 },
});
