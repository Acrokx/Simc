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

interface Cultivo {
  id_cultivo: number;
  nombre_cultivo: string;
  tipo_cultivo: string;
  ubicacion: string;
  tamaño_area: number;
  estado: string;
  id_finca: number;
}

export default function CultivosIndex() {
  const router = useRouter();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/cultivos/');
        setCultivos(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Error loading cultivos:', e);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Gestión de Cultivos' },
        ]} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🌱</Text>
            <Text style={styles.headerTitle}>Cultivos</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(admin)/cultivos/crear')}>
              <Text style={styles.addButtonText}>+ Nuevo Cultivo</Text>
            </TouchableOpacity>
          </View>
          {cultivos.length === 0 ? (
            <Text style={styles.emptyText}>No hay cultivos registrados.</Text>
          ) : cultivos.map((c) => (
            <TouchableOpacity key={c.id_cultivo} style={styles.card} onPress={() => router.push(`/(admin)/cultivos/detalle?id=${c.id_cultivo}`)}>
              <Text style={styles.cardTitle}>{c.nombre_cultivo}</Text>
              <Text style={styles.cardSubtitle}>{c.tipo_cultivo} • {c.estado} • {c.tamaño_area} m²</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/cultivos" onPress={(r) => router.push(r as any)} />
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
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginVertical: 20 },
});
