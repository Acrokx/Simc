import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme';

export default function EditarUsuario() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editar Usuario</Text>
        <Text style={styles.subtitle}>En construcción.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
});
