import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "../../../services/api";
import { colors } from "../../../theme";
import { getItem } from "../../../lib/storage";
import { MetricCard, AlertCard, RecommendationCard } from "../../../components/ui";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";
import { BottomNav } from "../../../components/ui/BottomNav";

interface Alerta {
    id_alerta: number;
    tipo_alerta: string;
    descripcion: string;
    fecha_alerta: string;
    prioridad: string;
    leida: boolean;
}

export default function AgricultorAlertas() {
  const router = useRouter();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [tab, setTab] = useState<'activas' | 'historial'>('activas');

  const loadAlertas = async () => {
    try {
      const leida = tab === 'activas' ? 'false' : 'true';
      const response = await api.get(`/alertas/?leida=${leida}`);
      setAlertas(response.data);
    } catch (error) {
      console.error("Error loading alertas:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const stored = await getItem('userData');
      if (stored) {
        loadAlertas();
      }
    };
    init();
  }, [tab]);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/alertas/marcar-leida/${id}/`, { leida: true });
      loadAlertas();
    } catch {
      // ignore
    }
  };

  const handleNavPress = (route: string) => router.replace(route);

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🚨</Text>
          <Text style={styles.headerTitle}>Alertas</Text>
          <Text style={styles.headerSubtitle}>{alertas.filter(a => !a.leida).length} sin leer</Text>
        </View>

        <View style={styles.tabRow}>
          {(['activas', 'historial'] as const).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'activas' ? 'Activas' : 'Historial'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {alertas.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>Sin alertas</Text>
            <Text style={styles.emptyText}>No hay alertas registradas.</Text>
          </View>
        ) : alertas.map((alerta) => (
          <TouchableOpacity key={alerta.id_alerta} onPress={() => !alerta.leida && markAsRead(alerta.id_alerta)}>
            <AlertCard
              title={alerta.tipo_alerta}
              description={alerta.descripcion}
              date={formatDate(alerta.fecha_alerta)}
              type={alerta.prioridad.toLowerCase() === 'alta' || alerta.prioridad.toLowerCase() === 'critica' ? 'error' : alerta.prioridad.toLowerCase() === 'media' ? 'warning' : 'info'}
              onPress={() => {}}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/alertas" onPress={handleNavPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  header: { paddingTop: 16, gap: 4 },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: colors.text.primary },
  headerSubtitle: { fontSize: 15, color: colors.text.secondary },
  tabRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.text.secondary },
  tabTextActive: { color: colors.card },
  emptyCard: { backgroundColor: colors.card, borderRadius: 24, padding: 36, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center' },
});