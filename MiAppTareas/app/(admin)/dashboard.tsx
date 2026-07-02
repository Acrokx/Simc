import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme';
import api from '../../services/api';
import { getItem } from '../../lib/storage';
import { DashboardHeader, MetricCard, AlertCard } from '../../components/ui';
import { BottomNav } from '../../components/ui/BottomNav';
import { ADMIN_BOTTOM_NAV } from '../../components/navigation/AdminNavigation';
import { Sidebar } from '../../components/layout/Sidebar';
import { Breadcrumb } from '../../components/layout/Breadcrumb';

function mapTone(prioridad: string): 'success' | 'warning' | 'error' | 'info' {
  const p = prioridad.toLowerCase();
  if (p === 'alta' || p === 'critica') return 'error';
  if (p === 'media') return 'warning';
  if (p === 'baja') return 'success';
  return 'info';
}

function formatDate(date: Date) {
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Hace menos de 1h';
  if (diffHours < 24) return `Hace ${diffHours}h`;
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

interface UserData {
  id_usuario: number;
  nombre: string;
  apellido: string;
  rol: string;
}

const quickActions = [
  { icon: '🏡', title: 'Crear finca', route: '/(admin)/fincas/crear' },
  { icon: '🌱', title: 'Registrar cultivo', route: '/(admin)/cultivos/crear' },
  { icon: '📡', title: 'Agregar sensor', route: '/(admin)/sensores/crear' },
  { icon: '👥', title: 'Crear agricultor', route: '/(admin)/usuarios/crear' },
  { icon: '☁️', title: 'Configuración', route: '/(admin)/configuracion/sistema' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState({
    fincas: 0,
    cultivos: 0,
    sensores: 0,
    sensoresActivos: 0,
    sensoresInactivos: 0,
    alertas: 0,
    alertasCriticas: 0,
    usuarios: 0,
    mediciones: 0,
    promedioHumedad: null as number | null,
  });
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await getItem('userData');
        if (stored) {
          const user = JSON.parse(stored) as UserData;
          if (user.rol?.toLowerCase() !== 'administrador') {
            router.replace('/(agricultor)/dashboard');
            return;
          }
          setUserData(user);
        } else {
          router.replace('/(auth)/login');
        }
        const dashboardRes = await api.get('/dashboard/');
        const d = dashboardRes.data?.data;
        if (d) {
          setStats({
            fincas: d.num_fincas ?? 0,
            cultivos: d.num_cultivos ?? 0,
            sensores: d.num_sensores ?? 0,
            sensoresActivos: d.sensores_activos ?? 0,
            sensoresInactivos: d.sensores_inactivos ?? 0,
            alertas: d.num_alertas_activas ?? 0,
            alertasCriticas: d.num_alertas_criticas ?? 0,
            usuarios: d.num_usuarios ?? 0,
            mediciones: d.mediciones_count ?? 0,
            promedioHumedad: d.promedio_humedad ?? null,
          });
        }
        const alertsRes = await api.get('/alertas/?leida=false');
        setRecentAlerts(Array.isArray(alertsRes.data) ? alertsRes.data.slice(0, 3) : []);
      } catch {
        router.replace('/(auth)/login');
      }
    };
    load();
  }, [router]);

  const handleNavPress = (route: string) => {
    router.push(route as any);
  };

  const statsCards = [
    { icon: '👥', label: 'Usuarios', value: String(stats.usuarios), sub: 'Activos' },
    { icon: '🏡', label: 'Fincas', value: String(stats.fincas), sub: 'Registradas' },
    { icon: '🌱', label: 'Cultivos', value: String(stats.cultivos), sub: 'Monitoreados' },
    { icon: '📡', label: 'Sensores', value: String(stats.sensores), sub: `Activos ${stats.sensoresActivos}` },
    { icon: '🚨', label: 'Alertas activas', value: String(stats.alertas), sub: 'Pendientes' },
    { icon: '🔴', label: 'Críticas', value: String(stats.alertasCriticas), sub: 'Urgentes' },
    { icon: '📈', label: 'Mediciones', value: String(stats.mediciones), sub: 'Registros' },
    { icon: '💧', label: 'Humedad prom.', value: stats.promedioHumedad !== null ? `${stats.promedioHumedad}%` : '--', sub: 'Promedio' },
  ];

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Panel Administrativo' },
        ]} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <DashboardHeader
            userName={userData?.nombre || 'Administrador'}
            farmName="Panel Administrativo"
            notificationCount={stats.alertas}
            onMenuPress={() => {}}
            onNotificationPress={() => router.push('/(admin)/alertas')}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KPIs principales</Text>
            <View style={styles.statsGrid}>
              {statsCards.map((item) => (
                <View key={item.label} style={styles.kpiCard}>
                  <Text style={styles.kpiIcon}>{item.icon}</Text>
                  <Text style={styles.kpiValue}>{item.value}</Text>
                  <Text style={styles.kpiLabel}>{item.label}</Text>
                  <Text style={styles.kpiSub}>{item.sub}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones rápidas</Text>
            <View style={styles.quickGrid}>
              {quickActions.map((item) => (
                <TouchableOpacity key={item.title} style={styles.quickButton} onPress={() => router.push(item.route as any)}>
                  <Text style={styles.quickIcon}>{item.icon}</Text>
                  <Text style={styles.quickTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas recientes</Text>
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <AlertCard
                  key={alert.id_alerta}
                  title={alert.tipo_alerta}
                  description={alert.descripcion}
                  date={formatDate(new Date(alert.fecha_alerta))}
                  type={mapTone(alert.prioridad)}
                  onPress={() => router.push('/(admin)/alertas')}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>✅</Text>
                <Text style={styles.emptyTitle}>Sin alertas pendientes</Text>
                <Text style={styles.emptyText}>El sistema no registra alertas activas en este momento.</Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/dashboard" onPress={handleNavPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  kpiIcon: { fontSize: 22 },
  kpiValue: { fontSize: 22, fontWeight: '800', color: colors.text.primary },
  kpiLabel: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
  kpiSub: { fontSize: 12, color: colors.text.muted, fontWeight: '600' },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 6,
  },
  quickIcon: {
    fontSize: 22,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  emptyState: { alignItems: 'center', paddingVertical: 28, gap: 10 },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  emptyText: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
});
