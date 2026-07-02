import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { BottomNav } from "../../../components/ui/BottomNav";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";

interface Cultivo {
  id_cultivo: number;
  nombre_cultivo: string;
  tipo_cultivo: string;
  estado: string;
}

export default function MisCultivos() {
  const router = useRouter();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/cultivos/');
        setCultivos(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Error loading cultivos:', e);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis Cultivos</Text>
        {cultivos.length === 0 ? (
          <Text style={styles.empty}>No hay cultivos registrados.</Text>
        ) : cultivos.map((c) => (
          <TouchableOpacity key={c.id_cultivo} style={styles.card} onPress={() => router.push(`/(agricultor)/mis-cultivos/detalle?id=${c.id_cultivo}`)}>
            <Text style={styles.cardTitle}>{c.nombre_cultivo}</Text>
            <Text style={styles.cardSubtitle}>{c.tipo_cultivo} • {c.estado}</Text>
          </TouchableOpacity>
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
