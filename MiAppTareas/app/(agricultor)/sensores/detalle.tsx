import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { BottomNav } from "../../../components/ui/BottomNav";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";

interface SensorItem {
  id_sensor: number;
  codigo_sensor?: string;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
  activo: boolean;
}

interface MedicionItem {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
}

export default function SensorDetalle() {
  const router = useRouter();
  const params = useSearchParams();
  const sensorId = Number(params.id);
  const [sensor, setSensor] = useState<SensorItem | null>(null);
  const [mediciones, setMediciones] = useState<MedicionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!sensorId) return;
      setLoading(true);
      try {
        const [sensoresRes, medicionesRes] = await Promise.all([
          api.get("/sensores/"),
          api.get(`/mediciones/?id_sensor=${sensorId}`),
        ]);
        const allSensores: SensorItem[] = Array.isArray(sensoresRes.data) ? sensoresRes.data : [];
        const found = allSensores.find(s => s.id_sensor === sensorId) || null;
        setSensor(found);
        setMediciones(Array.isArray(medicionesRes.data) ? medicionesRes.data : []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sensorId]);

  if (loading) {
    return (
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={styles.loading}>Cargando sensor...</Text>
      </View>
    );
  }

  if (!sensor) {
    return (
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={styles.empty}>Sensor no encontrado.</Text>
      </View>
    );
  }

  const ultima = mediciones[0];

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{sensor.codigo_sensor || sensor.tipo_sensor}</Text>
        <Text style={styles.subtitle}>{sensor.ubicacion} • {sensor.estado}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: sensor.activo ? colors.successBg : colors.errorBg, borderColor: sensor.activo ? colors.success : colors.error }]}>
            <Text style={[styles.badgeText, { color: sensor.activo ? colors.success : colors.error }]}>{sensor.activo ? 'Activo' : 'Inactivo'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Última lectura</Text>
          {ultima ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💧 {ultima.valor_humedad}%</Text>
              <Text style={styles.cardSubtitle}>{new Date(ultima.fecha_medicion).toLocaleString('es-CO')}</Text>
            </View>
          ) : (
            <Text style={styles.empty}>Sin mediciones registradas.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial reciente</Text>
          {mediciones.length === 0 ? (
            <Text style={styles.empty}>Sin historial.</Text>
          ) : mediciones.slice(0, 10).map(m => (
            <View key={m.id_medicion} style={styles.card}>
              <Text style={styles.cardTitle}>💧 {m.valor_humedad}%</Text>
              <Text style={styles.cardSubtitle}>{new Date(m.fecha_medicion).toLocaleString('es-CO')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/sensores" onPress={(r) => router.push(r as any)} />
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
