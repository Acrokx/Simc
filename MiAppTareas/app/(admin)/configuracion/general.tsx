import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from "../../../theme";
import api from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Breadcrumb } from "../../../components/layout/Breadcrumb";
import { BottomNav } from "../../../components/ui/BottomNav";
import { ADMIN_BOTTOM_NAV } from "../../../components/navigation/AdminNavigation";

interface ParametroGeneral {
  clave: string;
  valor: string;
  descripcion: string;
  actualizado_en: string;
}

export default function ParametrosGenerales() {
  const router = useRouter();
  const [parametros, setParametros] = useState<ParametroGeneral[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const loadParametros = async () => {
    setLoading(true);
    try {
      const res = await api.get('/configuracion/sistema/');
      const data = Array.isArray(res.data) ? res.data : [];
      setParametros(data);
    } catch (e) {
      console.error('Error loading parametros:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParametros();
  }, []);

  const handleSave = async (item: ParametroGeneral) => {
    try {
      await api.put(`/configuracion/sistema/${encodeURIComponent(item.clave)}/`, { valor: editValue });
      Alert.alert('Éxito', 'Parámetro actualizado.');
      setEditingKey(null);
      loadParametros();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el parámetro.');
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Sidebar />
      <View style={styles.mainContent}>
        <Breadcrumb items={[
          { label: 'Dashboard', route: '/(admin)/dashboard' },
          { label: 'Configuración', route: '/(admin)/configuracion/sistema' },
          { label: 'Parámetros Generales' },
        ]} />
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Parámetros Generales</Text>
          {parametros.length === 0 ? (
            <Text style={styles.emptyText}>No hay parámetros registrados.</Text>
          ) : parametros.map((p) => (
            <View key={p.clave} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{p.clave}</Text>
                {editingKey === p.clave ? (
                  <TouchableOpacity onPress={() => handleSave(p)}>
                    <Text style={styles.saveText}>Guardar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => { setEditingKey(p.clave); setEditValue(p.valor); }}>
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.cardSubtitle}>{p.descripcion || 'Sin descripción'}</Text>
              {editingKey === p.clave ? (
                <TextInput
                  style={styles.input}
                  value={editValue}
                  onChangeText={setEditValue}
                  autoFocus
                />
              ) : (
                <Text style={styles.cardValue}>{p.valor}</Text>
              )}
              <Text style={styles.cardDate}>Actualizado: {new Date(p.actualizado_en).toLocaleString('es-CO')}</Text>
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
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.border, gap: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  cardSubtitle: { fontSize: 13, color: colors.text.secondary },
  cardValue: { fontSize: 15, color: colors.text.primary, fontWeight: '600' },
  cardDate: { fontSize: 12, color: colors.text.muted },
  editText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  saveText: { color: colors.success, fontWeight: '700', fontSize: 14 },
  input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 14, fontSize: 15, color: colors.text.primary },
});

