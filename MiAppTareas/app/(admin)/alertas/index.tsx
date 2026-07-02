import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../../services/api";
import { colors } from "../../../theme";
import { getItem } from "../../../lib/storage";
import { BottomNav, AlertCard } from "../../../components/ui";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";

interface Alerta {
    id_alerta: number;
    tipo_alerta: string;
    descripcion: string;
    fecha_alerta: string;
    prioridad: string;
    leida: boolean;
}

function mapTone(prioridad: string): 'success' | 'warning' | 'error' | 'info' {
    const p = prioridad.toLowerCase();
    if (p === 'alta' || p === 'critica') return 'error';
    if (p === 'media') return 'warning';
    return 'success';
}

export default function AlertasScreen() {
  const router = useRouter();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filterActive, setFilterActive] = useState<'activas' | 'historico'>('activas');

  useEffect(() => {
    const init = async () => {
      const stored = await getItem('userData');
      if (!stored) {
        router.replace('/(auth)/login');
        return;
      }
      loadAlertas();
    };
    init();
  }, [filterActive]);

  const loadAlertas = async () => {
    try {
      const response = await api.get(`/alertas/?leida=${filterActive === 'activas' ? 'false' : 'true'}`);
      setAlertas(response.data);
    } catch (error) {
      console.error("Error loading alertas:", error);
    }
  };

  const handleNavPress = (route: string) => router.push(route as any);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/alertas/${id}/`, { leida: true });
      loadAlertas();
    } catch (error) {
      console.error("Error marking alerta as read:", error);
    }
  };

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Gestión de Alertas' },
        ]} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🚨</Text>
            <Text style={styles.headerTitle}>Alertas</Text>
            <Text style={styles.headerSubtitle}>{alertas.filter(a => !a.leida).length} sin leer</Text>
          </View>

          <View style={styles.filterRow}>
            {(['activas', 'historico'] as const).map((f) => (
              <TouchableOpacity key={f} style={[styles.filterChip, filterActive === f && styles.filterChipActive]} onPress={() => setFilterActive(f)}>
                <Text style={[styles.filterText, filterActive === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
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
            <View key={alerta.id_alerta} style={{ opacity: alerta.leida ? 0.6 : 1 }}>
              <AlertCard title={alerta.tipo_alerta} description={alerta.descripcion} date={formatDate(alerta.fecha_alerta)} type={mapTone(alerta.prioridad)} onPress={() => { if (!alerta.leida) markAsRead(alerta.id_alerta); }} />
            </View>
          ))}
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/alertas" onPress={handleNavPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  header: { paddingTop: 16, gap: 4 },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: colors.text.primary },
  headerSubtitle: { fontSize: 15, color: colors.text.secondary },
  filterRow: { flexDirection: 'row', gap: 10 },
  filterChip: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 14, color: colors.text.secondary },
  filterTextActive: { color: colors.card },
  emptyCard: { backgroundColor: colors.card, borderRadius: 24, padding: 36, alignItems: 'center', gap: 10 },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center' },
});