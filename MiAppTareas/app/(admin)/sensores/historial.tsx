import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme';
import api from '../../../services/api';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { BottomNav } from '../../../components/ui/BottomNav';
import { ADMIN_BOTTOM_NAV } from '../../../components/navigation/AdminNavigation';

interface Medicion {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
  id_sensor: number;
}

export default function HistorialSensor() {
  const router = useRouter();
  const [mediciones, setMediciones] = useState<Medicion[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/mediciones/');
        setMediciones(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Error loading historial:', e);
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
          { label: 'Sensores', route: '/(admin)/sensores' },
          { label: 'Historial' },
        ]} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Historial de Mediciones</Text>
          {mediciones.length === 0 ? (
            <Text style={styles.emptyText}>No hay mediciones registradas.</Text>
          ) : mediciones.map((m) => (
            <View key={m.id_medicion} style={styles.card}>
              <Text style={styles.cardTitle}>💧 {m.valor_humedad}%</Text>
              <Text style={styles.cardSubtitle}>{new Date(m.fecha_medicion).toLocaleString('es-CO')}</Text>
            </View>
          ))}
        </ScrollView>
        <BottomNav items={ADMIN_BOTTOM_NAV} activeRoute="/(admin)/sensores" onPress={(r) => router.push(r as any)} />
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
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.border, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 14, color: colors.text.secondary },
  emptyText: { fontSize: 15, color: colors.text.secondary, textAlign: 'center', marginVertical: 20 },
});
