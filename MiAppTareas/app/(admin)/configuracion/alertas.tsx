import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

interface Umbral {
  id: number;
  tipo: string;
  valor_minimo: number;
  valor_maximo: number;
  activa: boolean;
  mensaje_alerta: string;
  prioridad: string;
}

export default function ConfiguracionAlertas() {
  const router = useRouter();
  const [umbrales, setUmbrales] = useState<Umbral[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUmbrales = async () => {
    setLoading(true);
    try {
      const res = await api.get('/configuracion/umbrales/');
      setUmbrales(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Error loading umbrales:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUmbrales();
  }, []);

  const toggleUmbral = async (item: Umbral) => {
    try {
      await api.post(`/configuracion/umbrales/${item.id}/toggle/`);
      Alert.alert('Éxito', `Umbral ${item.activa ? 'desactivado' : 'activado'}.`);
      loadUmbrales();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el umbral.');
    }
  };

  const prioridadColor = (p: string) => {
    if (p === 'critica' || p === 'alta') return colors.error;
    if (p === 'media') return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Configuración', route: '/(admin)/configuracion/sistema' },
          { label: 'Configuración de Alertas' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Configuración de Alertas</Text>
          {umbrales.length === 0 ? (
            <Text style={styles.emptyText}>No hay reglas de alerta configuradas.</Text>
          ) : umbrales.map((u) => (
            <View key={u.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{u.tipo}</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, u.activa && styles.toggleButtonActive]}
                  onPress={() => toggleUmbral(u)}
                >
                  <Text style={[styles.toggleText, u.activa && styles.toggleTextActive]}>
                    {u.activa ? 'Activa' : 'Inactiva'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardRange}>
                Rango: {u.valor_minimo} - {u.valor_maximo}
              </Text>
              <Text style={styles.cardMessage}>{u.mensaje_alerta}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: prioridadColor(u.prioridad) + '18', borderColor: prioridadColor(u.prioridad) }]}>
                  <Text style={[styles.badgeText, { color: prioridadColor(u.prioridad) }]}>
                    {u.prioridad.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.border, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardRange: { fontSize: 15, color: colors.text.secondary, fontWeight: '600' },
  cardMessage: { fontSize: 14, color: colors.text.primary },
  badgeRow: { marginTop: 4 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  toggleButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  toggleButtonActive: { backgroundColor: colors.success + '18', borderColor: colors.success },
  toggleText: { fontSize: 13, fontWeight: '700', color: colors.text.secondary },
  toggleTextActive: { color: colors.success },
});
