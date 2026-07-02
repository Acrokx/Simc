import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { BottomNav } from "../../../components/ui/BottomNav";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";

export default function SensoresAgricultor() {
  const router = useRouter();
  const [sensores, setSensores] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/sensores/');
        setSensores(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Error loading sensores:', e);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis Sensores</Text>
        {sensores.length === 0 ? (
          <Text style={styles.empty}>No hay sensores registrados.</Text>
        ) : sensores.map((s) => (
          <View key={s.id_sensor} style={styles.card}>
            <Text style={styles.cardTitle}>{s.codigo_sensor || s.tipo_sensor}</Text>
            <Text style={styles.cardSubtitle}>{s.ubicacion} • {s.estado}</Text>
          </View>
        ))}
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/sensores" onPress={(r) => router.push(r as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 14, color: colors.text.secondary },
  empty: { fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginTop: 20 },
});
