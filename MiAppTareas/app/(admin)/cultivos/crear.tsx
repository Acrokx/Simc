import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme';
import api from '../../../services/api';

interface FincaOption {
  id_finca: number;
  nombre_finca: string;
}

export default function CrearCultivo() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [area, setArea] = useState('');
  const [fincas, setFincas] = useState<FincaOption[]>([]);
  const [fincaId, setFincaId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFincas = async () => {
      try {
        const res = await api.get('/fincas/');
        const options = Array.isArray(res.data) ? res.data : [];
        setFincas(options);
        if (options.length > 0 && !fincaId) {
          setFincaId(String(options[0].id_finca));
        }
      } catch (e) {
        console.error('Error loading fincas:', e);
      }
    };
    loadFincas();
  }, []);

  const handleCrear = async () => {
    if (!nombre.trim() || !tipo.trim() || !fincaId.trim()) {
      Alert.alert('Error', 'Nombre, tipo y finca son requeridos.');
      return;
    }
    const parsedFincaId = parseInt(fincaId, 10);
    const finca = fincas.find(f => f.id_finca === parsedFincaId);
    if (!finca) {
      Alert.alert('Error', 'Selecciona una finca válida.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/cultivos/', {
        nombre_cultivo: nombre.trim(),
        tipo_cultivo: tipo.trim(),
        tamaño_area: parseFloat(area) || 0,
        id_finca: finca.id_finca,
        estado: 'activo',
        fecha_siembra: new Date().toISOString().split('T')[0],
      });
      Alert.alert('Éxito', 'Cultivo creado correctamente.');
      router.replace('/(admin)/cultivos');
    } catch (error: any) {
      const backendMsg = typeof error?.response?.data === 'string'
        ? error.response.data
        : JSON.stringify(error?.response?.data || error?.message || 'Error desconocido');
      Alert.alert('Error', backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cultivo</Text>
      <TextInput style={styles.input} placeholder="Nombre del cultivo" placeholderTextColor={colors.text.muted} value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Tipo de cultivo" placeholderTextColor={colors.text.muted} value={tipo} onChangeText={setTipo} />
      <TextInput style={styles.input} placeholder="Área (m²)" placeholderTextColor={colors.text.muted} keyboardType="numeric" value={area} onChangeText={setArea} />
      {fincas.length === 0 ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>No hay fincas registradas.</Text>
          <TouchableOpacity onPress={() => router.push('/(admin)/fincas/crear')}>
            <Text style={styles.warningLink}>Crear una finca primero</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pickerRow}>
          {fincas.map(f => (
            <TouchableOpacity
              key={f.id_finca}
              style={[styles.chip, fincaId === String(f.id_finca) && styles.chipActive]}
              onPress={() => setFincaId(String(f.id_finca))}
            >
              <Text style={[styles.chipText, fincaId === String(f.id_finca) && styles.chipTextActive]}>{f.nombre_finca}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleCrear} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Crear Cultivo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text.primary },
  input: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: colors.text.primary },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', width: '100%' },
  buttonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  link: { color: colors.primary, fontSize: 14, fontWeight: '600', marginTop: 8 },
  pickerRow: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text.secondary, fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: colors.card },
  warningBox: { width: '100%', backgroundColor: colors.warning + '18', borderWidth: 1, borderColor: colors.warning, borderRadius: 14, padding: 16, alignItems: 'center', gap: 8 },
  warningText: { color: colors.text.primary, fontWeight: '600', fontSize: 14 },
  warningLink: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
