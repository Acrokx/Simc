import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme';
import api from '../../../services/api';
import { getItem } from '../../../lib/storage';
import { BottomNav } from '../../../components/ui/BottomNav';
import { ADMIN_BOTTOM_NAV } from '../../../components/navigation/AdminNavigation';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';

interface Finca {
  id_finca: number;
  nombre_finca: string;
  ubicacion: string;
  tamaño_hectareas: number;
  tipo_cultivo?: string;
  estado?: string;
}

export default function FincasIndex() {
  const router = useRouter();
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/fincas/');
      setFincas(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('No se pudieron cargar las fincas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Gestión de Fincas' },
        ]} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🏡</Text>
            <Text style={styles.headerTitle}>Fincas</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(admin)/fincas/crear')}>
              <Text style={styles.addButtonText}>+ Nueva Finca</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>Cargando fincas...</Text>
            </View>
          ) : error ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={load}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : fincas.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.emptyEmoji}>🏡</Text>
              <Text style={styles.emptyTitle}>Sin fincas</Text>
              <Text style={styles.emptyText}>Registra tu primera finca para comenzar.</Text>
            </View>
          ) : fincas.map((f) => (
            <TouchableOpacity key={f.id_finca} style={styles.card} onPress={() => router.push(`/(admin)/fincas/detalle?id=${f.id_finca}`)}>
              <Text style={styles.cardTitle}>{f.nombre_finca}</Text>
              <Text style={styles.cardSubtitle}>{f.ubicacion} • {f.tamaño_hectareas} ha • {f.estado || 'Sin estado'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/fincas" onPress={(r) => router.push(r as any)} />
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
  addButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
  addButtonText: { color: colors.card, fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.border, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 14, color: colors.text.secondary },
  stateCard: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  stateText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center' },
  emptyEmoji: { fontSize: 40, marginBottom: 4 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  emptyText: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: colors.card, fontWeight: '700', fontSize: 14 },
});
