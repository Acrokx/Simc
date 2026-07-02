import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

interface Log {
  id: number;
  usuario?: string;
  accion: string;
  modulo: string;
  ip: string;
  detalles: string;
  fecha: string;
}

interface Estadisticas {
  total_alertas: number;
  total_mediciones: number;
  total_usuarios: number;
  total_fincas: number;
  total_cultivos: number;
  total_sensores: number;
}

export default function MonitoreoSistema() {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'logs' | 'estadisticas'>('logs');

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        api.get('/configuracion/logs/'),
        api.get('/configuracion/estadisticas/'),
      ]);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
      setEstadisticas(statsRes.data);
    } catch (e) {
      console.error('Error loading monitoreo:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (fecha: string) => {
    const d = new Date(fecha);
    return `${d.toLocaleDateString('es-CO')} ${d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Configuración', route: '/(admin)/configuracion/sistema' },
          { label: 'Monitoreo del Sistema' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tab, tab === 'logs' && styles.tabActive]} onPress={() => setTab('logs')}>
              <Text style={[styles.tabText, tab === 'logs' && styles.tabTextActive]}>Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab === 'estadisticas' && styles.tabActive]} onPress={() => setTab('estadisticas')}>
              <Text style={[styles.tabText, tab === 'estadisticas' && styles.tabTextActive]}>Estadísticas</Text>
            </TouchableOpacity>
          </View>

          {tab === 'estadisticas' && estadisticas && (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{estadisticas.total_alertas}</Text>
                <Text style={styles.statLabel}>Alertas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{estadisticas.total_mediciones}</Text>
                <Text style={styles.statLabel}>Mediciones</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{estadisticas.total_usuarios}</Text>
                <Text style={styles.statLabel}>Usuarios</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{estadisticas.total_fincas}</Text>
                <Text style={styles.statLabel}>Fincas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{estadisticas.total_cultivos}</Text>
                <Text style={styles.statLabel}>Cultivos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{estadisticas.total_sensores}</Text>
                <Text style={styles.statLabel}>Sensores</Text>
              </View>
            </View>
          )}

          {tab === 'logs' && (
            <View style={styles.logsContainer}>
              {logs.length === 0 ? (
                <Text style={styles.emptyText}>No hay logs registrados.</Text>
              ) : logs.map((log) => (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logModule}>{log.modulo}</Text>
                    <Text style={styles.logDate}>{formatDate(log.fecha)}</Text>
                  </View>
                  <Text style={styles.logAction}>{log.accion}</Text>
                  {log.detalles ? (
                    <Text style={styles.logDetails}>{log.detalles}</Text>
                  ) : null}
                  <View style={styles.logFooter}>
                    <Text style={styles.logUser}>{log.usuario || 'Sistema'}</Text>
                    <Text style={styles.logIp}>{log.ip || 'N/A'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/configuracion/sistema" onPress={(r) => router.push(r as any)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  tabRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.text.secondary },
  tabTextActive: { color: colors.card },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  statCard: { width: '47%', backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 6, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800', color: colors.text.primary },
  statLabel: { fontSize: 13, color: colors.text.secondary, fontWeight: '600' },
  logsContainer: { gap: 12 },
  logCard: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 8 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logModule: { fontSize: 13, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  logDate: { fontSize: 12, color: colors.text.muted },
  logAction: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  logDetails: { fontSize: 13, color: colors.text.secondary },
  logFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  logUser: { fontSize: 12, color: colors.text.secondary },
  logIp: { fontSize: 12, color: colors.text.muted },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginVertical: 20 },
});
