import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { BottomNav } from "../../../components/ui/BottomNav";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";

interface Finca {
  id_finca: number;
  nombre_finca: string;
  ubicacion: string;
  tamaño_hectareas: number;
  estado: string;
  descripcion?: string;
}

interface Cultivo {
  id_cultivo: number;
  nombre_cultivo: string;
  tipo_cultivo: string;
  estado: string;
  fecha_siembra?: string;
}

interface Sensor {
  id_sensor: number;
  codigo_sensor?: string;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
  activo: boolean;
}

export default function DetalleFinca() {
  const router = useRouter();
  const params = useSearchParams();
  const fincaId = Number(params.id);
  const [finca, setFinca] = useState<Finca | null>(null);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!fincaId) return;
      setLoading(true);
      try {
        const [fincasRes, cultivosRes, sensoresRes] = await Promise.all([
          api.get('/fincas/'),
          api.get(`/cultivos/?id_finca=${fincaId}`),
          api.get('/sensores/'),
        ]);
        const fincasList: Finca[] = Array.isArray(fincasRes.data) ? fincasRes.data : [];
        const found = fincasList.find(f => f.id_finca === fincaId) || null;
        setFinca(found);

        const cultivosList: Cultivo[] = Array.isArray(cultivosRes.data) ? cultivosRes.data : [];
        setCultivos(cultivosList);

        const sensoresList: Sensor[] = Array.isArray(sensoresRes.data) ? sensoresRes.data : [];
        const cultivoIds = cultivosList.map(c => c.id_cultivo);
        const filtered = cultivoIds.length > 0 ? sensoresList.filter(s => cultivoIds.includes(Number(s.id_cultivo))) : [];
        setSensores(filtered);
      } catch {
        // silent fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fincaId]);

  if (loading) {
    return (
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={styles.loading}>Cargando finca...</Text>
      </View>
    );
  }

  if (!finca) {
    return (
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={styles.empty}>Finca no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{finca.nombre_finca}</Text>
        <Text style={styles.subtitle}>{finca.ubicacion} • {finca.tamaño_hectareas} ha</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
            <Text style={[styles.badgeText, { color: colors.success }]}>{finca.estado}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultivos ({cultivos.length})</Text>
          {cultivos.length === 0 ? (
            <Text style={styles.empty}>No hay cultivos registrados en esta finca.</Text>
          ) : cultivos.map(c => (
            <TouchableOpacity key={c.id_cultivo} style={styles.card} onPress={() => router.push(`/(agricultor)/mis-cultivos/detalle?id=${c.id_cultivo}`)}>
              <Text style={styles.cardTitle}>{c.nombre_cultivo}</Text>
              <Text style={styles.cardSubtitle}>{c.tipo_cultivo} • {c.estado}{c.fecha_siembra ? ` • Siembra: ${c.fecha_siembra}` : ''}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensores instalados ({sensores.length})</Text>
          {sensores.length === 0 ? (
            <Text style={styles.empty}>No hay sensores registrados en los cultivos de esta finca.</Text>
          ) : sensores.map(s => (
            <View key={s.id_sensor} style={styles.card}>
              <Text style={styles.cardTitle}>{s.codigo_sensor || s.tipo_sensor}</Text>
              <Text style={styles.cardSubtitle}>{s.ubicacion} • {s.estado} • {s.activo ? 'Activo' : 'Inactivo'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/mis-fincas" onPress={(r) => router.push(r as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  badgeRow: { flexDirection: 'row', marginTop: 10 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 14, color: colors.text.secondary },
  empty: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginTop: 12 },
  loading: { fontSize: 16, color: colors.text.secondary, textAlign: 'center', marginTop: 24 },
});
