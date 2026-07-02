import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

interface LogEntry {
  id: number;
  usuario?: string;
  accion: string;
  modulo: string;
  ip: string;
  detalles: string;
  fecha: string;
}

export default function ConfiguracionAPI() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/configuracion/logs/');
      const data = Array.isArray(res.data) ? res.data : [];
      setLogs(data);
    } catch (e) {
      console.error('Error loading logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
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
          { label: 'Configuración de API' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Configuración de API</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{logs.length}</Text>
              <Text style={styles.summaryLabel}>Registros</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={loadLogs}>
              <Text style={styles.refreshText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>No hay registros de API/logs.</Text>
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
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/configuracion/api" onPress={(r) => router.push(r as any)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  summaryCard: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', minWidth: 120 },
  summaryValue: { fontSize: 28, fontWeight: '800', color: colors.text.primary },
  summaryLabel: { fontSize: 13, color: colors.text.secondary, fontWeight: '600' },
  refreshButton: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  refreshText: { color: colors.card, fontWeight: '700', fontSize: 14 },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginVertical: 20 },
  logCard: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 8 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logModule: { fontSize: 13, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  logDate: { fontSize: 12, color: colors.text.muted },
  logAction: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  logDetails: { fontSize: 13, color: colors.text.secondary },
  logFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  logUser: { fontSize: 12, color: colors.text.secondary },
  logIp: { fontSize: 12, color: colors.text.muted },
});
