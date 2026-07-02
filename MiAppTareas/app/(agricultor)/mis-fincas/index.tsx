import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { getItem } from "../../../lib/storage";
import { BottomNav } from "../../../components/ui/BottomNav";
import { AGRICULTOR_BOTTOM_NAV } from "../../../components/navigation/FarmerNavigation";

interface Finca {
  id_finca: number;
  nombre_finca: string;
  ubicacion: string;
  tamaño_hectareas: number;
  estado: string;
  id_usuario: number;
}

interface Cultivo {
  id_cultivo: number;
  nombre_cultivo: string;
  tipo_cultivo: string;
  estado: string;
}

interface Sensor {
  id_sensor: number;
  codigo_sensor?: string;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
}

export default function MisFincas() {
  const router = useRouter();
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [cultivos, setCultivos] = useState<Record<number, Cultivo[]>>({});
  const [sensores, setSensores] = useState<Record<number, Sensor[]>>({});

  const loadFincas = async () => {
    setLoading(true);
    setError(null);
    try {
      const userStr = await getItem('userData');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id_usuario || user?.id_usuario;
      const res = await api.get('/fincas/');
      const data: Finca[] = Array.isArray(res.data) ? res.data : [];
      const filtered = userId ? data.filter(f => Number(f.id_usuario) === Number(userId)) : data;
      setFincas(filtered);
    } catch {
      setError('No se pudieron cargar tus fincas.');
    } finally {
      setLoading(false);
    }
  };

  const loadCultivosForFinca = async (fincaId: number) => {
    try {
      const res = await api.get(`/cultivos/?id_finca=${fincaId}`);
      setCultivos(prev => ({ ...prev, [fincaId]: Array.isArray(res.data) ? res.data : [] }));
    } catch {
      setCultivos(prev => ({ ...prev, [fincaId]: [] }));
    }
  };

  const loadSensoresForCultivo = async (cultivoId: number, fincaId: number) => {
    try {
      const res = await api.get(`/sensores/?id_cultivo=${cultivoId}`);
      const list: Sensor[] = Array.isArray(res.data) ? res.data : [];
      setSensores(prev => {
        const current = prev[fincaId] || [];
        const without = current.filter(s => !list.some(n => n.id_sensor === s.id_sensor));
        return { ...prev, [fincaId]: [...without, ...list] };
      });
    } catch {
      // keep previous sensors for this finca
    }
  };

  useEffect(() => {
    loadFincas();
  }, []);

  const toggleExpand = async (finca: Finca) => {
    const next = expandedId === finca.id_finca ? null : finca.id_finca;
    setExpandedId(next);
    if (next === finca.id_finca) {
      await loadCultivosForFinca(finca.id_finca);
      const items = cultivos[finca.id_finca];
      if (items && items.length > 0) {
        items.forEach(c => loadSensoresForCultivo(c.id_cultivo, finca.id_finca));
      }
    }
  };

  const renderSensores = (fincaId: number) => {
    const list = sensores[fincaId] || [];
    if (list.length === 0) return <Text style={styles.emptyText}>Sin sensores registrados.</Text>;
    return list.map(s => (
      <View key={s.id_sensor} style={styles.sensorItem}>
        <Text style={styles.sensorName}>{s.codigo_sensor || s.tipo_sensor}</Text>
        <Text style={styles.sensorMeta}>{s.ubicacion} • {s.estado}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis Fincas</Text>
        {loading ? (
          <Text style={styles.emptyText}>Cargando...</Text>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadFincas}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : fincas.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.emptyEmoji}>🏡</Text>
            <Text style={styles.emptyTitle}>Sin fincas</Text>
            <Text style={styles.emptyText}>No tienes fincas asignadas.</Text>
          </View>
        ) : fincas.map(f => (
          <View key={f.id_finca} style={styles.card}>
            <TouchableOpacity onPress={() => router.push(`/(agricultor)/mis-fincas/detalle?id=${f.id_finca}`)}>
              <Text style={styles.cardTitle}>{f.nombre_finca}</Text>
              <Text style={styles.cardSubtitle}>{f.ubicacion} • {f.tamaño_hectareas} ha • {f.estado}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.expandButton} onPress={() => toggleExpand(f)}>
              <Text style={styles.expandText}>{expandedId === f.id_finca ? 'Ocultar detalles' : 'Ver cultivos y sensores'}</Text>
            </TouchableOpacity>
            {expandedId === f.id_finca && (
              <View style={styles.details}>
                <Text style={styles.detailTitle}>Cultivos</Text>
                {(() => {
                  const items = cultivos[f.id_finca];
                  if (!items) return <Text style={styles.emptyText}>Cargando...</Text>;
                  if (items.length === 0) return <Text style={styles.emptyText}>Sin cultivos.</Text>;
                  return items.map(c => (
                    <View key={c.id_cultivo} style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{c.nombre_cultivo}</Text>
                      <Text style={styles.itemMeta}>{c.tipo_cultivo} • {c.estado}</Text>
                      <TouchableOpacity style={styles.linkButton} onPress={() => router.push(`/(agricultor)/mis-cultivos/detalle?id=${c.id_cultivo}`)}>
                        <Text style={styles.linkText}>Ver cultivo</Text>
                      </TouchableOpacity>
                    </View>
                  ));
                })()}
                <Text style={styles.detailTitle}>Sensores</Text>
                {renderSensores(f.id_finca)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <BottomNav items={AGRICULTOR_BOTTOM_NAV} activeRoute="/(agricultor)/mis-fincas" onPress={(r) => router.push(r as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 24, paddingBottom: 120, gap: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 10 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 14, color: colors.text.secondary },
  expandButton: { alignSelf: 'flex-start', marginTop: 4 },
  expandText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  details: { marginTop: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, gap: 10 },
  detailTitle: { fontSize: 14, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase' },
  itemRow: { gap: 4, marginBottom: 8 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  itemMeta: { fontSize: 13, color: colors.text.secondary },
  linkButton: { alignSelf: 'flex-start', marginTop: 6 },
  linkText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  sensorItem: { gap: 2, marginBottom: 6 },
  sensorName: { fontSize: 14, fontWeight: '700', color: colors.text.primary },
  sensorMeta: { fontSize: 12, color: colors.text.secondary },
  emptyText: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginTop: 12 },
  stateCard: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyEmoji: { fontSize: 40, marginBottom: 4 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: colors.card, fontWeight: '700', fontSize: 14 },
});
