import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { MetricCard, AlertCard, RecommendationCard } from "../../../components/ui";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";
import { BottomNav } from "../../../components/ui/BottomNav";

interface Medicion {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
  id_sensor: number;
}

interface SensorInfo {
  id_sensor: number;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
}

export default function EstadisticasScreen() {
  const router = useRouter();
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [sensores, setSensores] = useState<SensorInfo[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/mediciones/");
        setMediciones(Array.isArray(res.data) ? res.data.slice(0, 20) : []);
      } catch {
        // offline fallback
      }
      try {
        const res2 = await api.get("/sensores/");
        setSensores(Array.isArray(res2.data) ? res2.data : []);
      } catch {
        // offline fallback
      }
    };
    load();
  }, []);

  const promedios = mediciones.reduce(
    (acc, m) => {
      acc.sum += Number(m.valor_humedad) || 0;
      acc.count += 1;
      return acc;
    },
    { sum: 0, count: 0 }
  );
  const promedio = promedios.count > 0 ? promedios.sum / promedios.count : 0;

  const barras = mediciones.slice(0, 7).map((m) => Number(m.valor_humedad) || 0);
  const maxBar = Math.max(...barras, 1);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>📈</Text>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <Text style={styles.headerSubtitle}>Tendencias y comportamiento de tus cultivos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicadores principales</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              icon="💧"
              label="Humedad prom."
              value={promedio ? promedio.toFixed(1) : "—"}
              unit="%"
              status={promedio < 30 ? "Bajo" : promedio > 80 ? "Alto" : "Óptimo"}
              progress={promedio ? Math.min(Math.max(promedio, 0), 100) : 0}
              showProgress
            />
            <MetricCard
              icon="🌡️"
              label="Temperatura"
              value="24.6"
              unit="°C"
              status="Normal"
              progress={55}
              showProgress
            />
            <MetricCard
              icon="📡"
              label="Sensores"
              value={String(sensores.length)}
              status="Activos"
              progress={sensores.length > 0 ? 80 : 0}
              showProgress
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Humedad últimos días</Text>
          <View style={styles.chartContainer}>
            {barras.length === 0 ? (
              <Text style={styles.noData}>Sin datos</Text>
            ) : (
              <View style={styles.chartRow}>
                {barras.map((valor, index) => (
                  <View key={index} style={styles.barWrap}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.round((valor / maxBar) * 100)}%`,
                          backgroundColor: valor < 30 ? colors.error : valor > 80 ? colors.warning : colors.primary,
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{valor.toFixed(0)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendación</Text>
          <RecommendationCard
            message="Los niveles de humedad se mantienen estables. Continúa con el programa de riego actual."
            actionLabel="Ver sensores"
            onAction={() => router.push("/(agricultor)/sensores")}
          />
        </View>
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/estadisticas" onPress={(r) => router.push(r as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  header: { paddingTop: 16, gap: 4 },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 34, fontWeight: "800", color: colors.text.primary, letterSpacing: -1 },
  headerSubtitle: { fontSize: 15, color: colors.text.secondary, fontWeight: "500" },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  chartContainer: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border },
  chartRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: 140 },
  barWrap: { flex: 1, alignItems: "center", gap: 6 },
  bar: { width: "70%", borderRadius: 8, minHeight: 8 },
  barLabel: { fontSize: 11, color: colors.text.secondary, fontWeight: "600" },
  noData: { fontSize: 14, color: colors.text.secondary, textAlign: "center", paddingVertical: 40 },
});
