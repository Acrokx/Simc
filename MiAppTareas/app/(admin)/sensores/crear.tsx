import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme';
import api from '../../../services/api';

interface CultivoOption {
  id_cultivo: number;
  nombre_cultivo: string;
}

export default function CrearSensor() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cultivos, setCultivos] = useState<CultivoOption[]>([]);
  const [cultivoId, setCultivoId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCultivos = async () => {
      try {
        const res = await api.get('/cultivos/');
        const options = Array.isArray(res.data) ? res.data : [];
        setCultivos(options);
        if (options.length > 0 && !cultivoId) {
          setCultivoId(String(options[0].id_cultivo));
        }
      } catch (e) {
        console.error('Error loading cultivos:', e);
      }
    };
    loadCultivos();
  }, []);

  const handleCrear = async () => {
    if (!tipo.trim() || !ubicacion.trim()) {
      Alert.alert('Error', 'Tipo y ubicación son requeridos.');
      return;
    }
    const parsedCultivoId = parseInt(cultivoId, 10);
    const cultivo = cultivos.find(c => c.id_cultivo === parsedCultivoId);
    if (!cultivo) {
      Alert.alert('Error', 'Selecciona un cultivo válido.');
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        tipo_sensor: tipo.trim(),
        ubicacion: ubicacion.trim(),
        id_cultivo: cultivoId ? parseInt(cultivoId, 10) : undefined,
        estado: 'activo',
        activo: true,
      };
      if (codigo.trim()) {
        payload.codigo_sensor = codigo.trim();
      }
      if (!payload.id_cultivo) {
        Alert.alert('Error', 'Selecciona un cultivo válido.');
        return;
      }
      await api.post('/sensores/', payload);
      Alert.alert('Éxito', 'Sensor creado correctamente.');
      router.replace('/(admin)/sensores');
    } catch (error: any) {
      const data = error?.response?.data;
      let msg = error?.message || 'Error desconocido';
      if (data && typeof data === 'object') {
        const entries = Object.entries(data);
        if (entries.length === 1) {
          const [k, v] = entries[0];
          msg = `${k}: ${Array.isArray(v) ? v.join(', ') : v}`;
        } else {
          msg = entries.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
        }
      } else if (typeof data === 'string') {
        msg = data;
      }
      Alert.alert('Error al crear sensor', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Sensor</Text>
      <TextInput style={styles.input} placeholder="Código (opcional)" placeholderTextColor={colors.text.muted} value={codigo} onChangeText={setCodigo} />
      <TextInput style={styles.input} placeholder="Tipo de sensor" placeholderTextColor={colors.text.muted} value={tipo} onChangeText={setTipo} />
      <TextInput style={styles.input} placeholder="Ubicación" placeholderTextColor={colors.text.muted} value={ubicacion} onChangeText={setUbicacion} />
      {cultivos.length === 0 ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>No hay cultivos registrados.</Text>
          <TouchableOpacity onPress={() => router.push('/(admin)/cultivos/crear')}>
            <Text style={styles.warningLink}>Crear un cultivo primero</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pickerRow}>
          {cultivos.map(c => (
            <TouchableOpacity
              key={c.id_cultivo}
              style={[styles.chip, cultivoId === String(c.id_cultivo) && styles.chipActive]}
              onPress={() => setCultivoId(String(c.id_cultivo))}
            >
              <Text style={[styles.chipText, cultivoId === String(c.id_cultivo) && styles.chipTextActive]}>{c.nombre_cultivo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleCrear} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Crear Sensor'}</Text>
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
