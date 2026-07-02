import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { BottomNav } from "../../../components/ui/BottomNav";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";

interface Medicion {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
}

export default function HistorialCultivo() {
  const router = useRouter();
  const [mediciones, setMediciones] = useState<Medicion[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/mediciones/');
        setMediciones(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Error loading historial:', e);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Historial</Text>
        {mediciones.length === 0 ? (
          <Text style={styles.empty}>No hay mediciones.</Text>
        ) : mediciones.map((m) => (
          <View key={m.id_medicion} style={styles.card}>
            <Text style={styles.cardTitle}>💧 {m.valor_humedad}%</Text>
            <Text style={styles.cardSubtitle}>{new Date(m.fecha_medicion).toLocaleString('es-CO')}</Text>
          </View>
        ))}
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/mis-cultivos" onPress={(r) => router.push(r as any)} />
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
