import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

const configModules = [
  { icon: '⚙️', title: 'Parámetros Generales', subtitle: 'Variables y ajustes globales', route: '/(admin)/configuracion/general' },
  { icon: '🚨', title: 'Configuración de Alertas', subtitle: 'Umbrales y reglas de alerta', route: '/(admin)/configuracion/alertas' },
  { icon: '📡', title: 'Configuración de API', subtitle: 'Logs y parámetros de integración', route: '/(admin)/configuracion/api' },
  { icon: '📧', title: 'Correos Electrónicos', subtitle: 'SMTP y notificaciones', route: '/(admin)/configuracion/correos' },
  { icon: '📊', title: 'Monitoreo del Sistema', subtitle: 'Estadísticas y logs', route: '/(admin)/configuracion/monitoreo' },
  { icon: '💾', title: 'Copias de Seguridad', subtitle: 'Respaldos del sistema', route: '/(admin)/configuracion/backups' },
  { icon: '🧠', title: 'Configuración IA', subtitle: 'Reglas inteligentes', route: '/(admin)/configuracion/inteligente' },
];

export default function ConfiguracionSistemaHub() {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Configuración del Sistema' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>☁️ Configuración del Sistema</Text>
          <View style={styles.grid}>
            {configModules.map((mod) => (
              <TouchableOpacity key={mod.route} style={styles.card} onPress={() => router.push(mod.route as any)}>
                <Text style={styles.cardIcon}>{mod.icon}</Text>
                <Text style={styles.cardTitle}>{mod.title}</Text>
                <Text style={styles.cardSubtitle}>{mod.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { width: '47%', backgroundColor: colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 10 },
  cardIcon: { fontSize: 28, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 13, color: colors.text.secondary },
});
