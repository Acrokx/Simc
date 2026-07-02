import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "../../services/api";
import { colors } from "../../theme";
import { getItem } from "../../lib/storage";
import { DashboardHeader, MetricCard } from "../../components/ui";
import { ADMIN_BOTTOM_NAV } from "../../components/navigation/AdminNavigation";
import { BottomNav } from "../../components/ui/BottomNav";
import { Sidebar } from "../../components/layout/Sidebar";
import { Breadcrumb } from "../../components/layout/Breadcrumb";

interface Sensor {
  id_sensor: number;
  codigo_sensor?: string;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
}

interface Medicion {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
  id_sensor: number;
}

export default function MedicionesScreen() {
  const router = useRouter();
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [sensorSeleccionado, setSensorSeleccionado] = useState<number | null>(null);
  const [valorHumedad, setValorHumedad] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSensores();
    loadMediciones();
  }, []);

  const loadSensores = async () => {
    try {
      const response = await api.get("/sensores/");
      setSensores(response.data);
    } catch (error) {
      console.error("Error loading sensores:", error);
    }
  };

  const loadMediciones = async (sensorId?: number) => {
    try {
      const url = sensorId ? `/mediciones/?id_sensor=${sensorId}` : "/mediciones/";
      const response = await api.get(url);
      setMediciones(response.data);
    } catch (error) {
      console.error("Error loading mediciones:", error);
    }
  };

  const handleSubmit = async () => {
    if (!sensorSeleccionado || !valorHumedad.trim()) {
      alert("Selecciona un sensor y completa la humedad.");
      return;
    }

    const humedad = parseFloat(valorHumedad.replace(',', '.'));
    if (Number.isNaN(humedad) || humedad < 0 || humedad > 100) {
      alert("Ingresa un valor de humedad válido entre 0 y 100.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/mediciones/crear/", {
        id_sensor: sensorSeleccionado,
        valor_humedad: humedad,
      });
      setValorHumedad("");
      loadMediciones(sensorSeleccionado);
    } catch (error) {
      console.error("Error creating medicion:", error);
    } finally {
      setLoading(false);
    }
  };

  const sensorName = (id: number) => sensores.find(s => s.id_sensor === id)?.tipo_sensor || `Sensor ${id}`;
  const latest = sensorSeleccionado ? mediciones[0] : null;

  const handleNavPress = (route: string) => router.replace(route);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Breadcrumb items={[{ label: 'Dashboard', route: '/(admin)/dashboard' }, { label: 'Estadísticas' }]} />
        
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <Text style={styles.headerSubtitle}>Datos históricos y reportes del sistema</Text>
        </View>

        <View style={styles.statsGrid}>
          <MetricCard icon="📡" label="Sensores" value={String(sensores.length)} status="Registrados" />
          <MetricCard icon="📈" label="Mediciones" value={String(mediciones.length)} status="Registros" />
          <MetricCard icon="💧" label="Humedad prom." value={latest ? `${latest.valor_humedad.toFixed(1)}%` : "—"} status={latest ? (latest.valor_humedad >= 50 ? "Óptima" : "Baja") : "Sin datos"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Mediciones</Text>
          {mediciones.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No hay mediciones registradas.</Text>
            </View>
          ) : (
            mediciones.slice(0, 20).map((medicion) => (
              <View key={medicion.id_medicion} style={styles.recordCard}>
                <View style={styles.recordLeft}>
                  <Text style={styles.recordIcon}>💧</Text>
                  <View>
                    <Text style={styles.recordTitle}>{sensorName(medicion.id_sensor)}</Text>
                    <Text style={styles.recordDate}>
                      {new Date(medicion.fecha_medicion).toLocaleString("es-CO")}
                    </Text>
                  </View>
                </View>
                <View style={styles.humidityBadge}>
                  <Text style={styles.humidityValue}>{medicion.valor_humedad.toFixed(1)}%</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/mediciones" onPress={handleNavPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  header: { paddingTop: 16, gap: 4 },
  headerEmoji: { fontSize: 36, marginBottom: 4 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: colors.text.primary, letterSpacing: -1 },
  headerSubtitle: { fontSize: 15, color: colors.text.secondary, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  recordIcon: { fontSize: 28 },
  recordTitle: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  recordDate: { fontSize: 12, color: colors.text.secondary },
  humidityBadge: { backgroundColor: colors.successBg, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  humidityValue: { color: colors.secondary, fontSize: 15, fontWeight: '700' },
  emptyCard: { backgroundColor: colors.card, borderRadius: 24, padding: 32, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center' },
});